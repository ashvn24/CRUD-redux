from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializer import CustomUserSerializer,ImageSerializer
from .models import CustomUser,UserImage
import jwt, datetime
from rest_framework.exceptions import ValidationError
from rest_framework import status,generics
from rest_framework.parsers import MultiPartParser, FormParser

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        phone = data.get('phone')

        if CustomUser.objects.filter(email=email).exists():
            print('Email already exists')
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(phone=phone).exists():
            print('Phone number already exists')
            return Response({'error': 'Phone number already exists'}, status=status.HTTP_400_BAD_REQUEST)
        

        serializer = CustomUserSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class LoginView(APIView):
    def post(self, request):  # sourcery skip: aware-datetime-for-utc
        email = request.data['email']
        password = request.data['password']
       
        print(email)
        print(password)
        if not (email and password):
            return Response({
                'error': 'Email and Password is required'
            })
       
        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed({
                'error':'User is not found'
            })
        
        if not user.check_password(password):
            raise AuthenticationFailed({'error':'Incorrrect Password'})
        
        payload = {
            'id':user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat':datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, 'secret', algorithm="HS256")
        response = Response()
    
        response.data = {
            'jwt': token
        }
    
        return response
    

class UserView(APIView):
    def get(self, request):  # sourcery skip: raise-from-previous-error
        auth_header = request.headers.get('Authorization')

        if not auth_header or 'Bearer ' not in auth_header:
            raise AuthenticationFailed("Not authorized")

        token = auth_header.split('Bearer ')[1]
        try:
            payload = jwt.decode(token, 'secret', algorithms=["HS256"])
            user = CustomUser.objects.filter(id=payload['id']).first()
            serializer = CustomUserSerializer(user)
            response_data = {
                'id': user.id,  
                'user_data': serializer.data
            }
            return Response(response_data)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Not authorized")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
        
class UserImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or 'Bearer ' not in auth_header:
            raise AuthenticationFailed("Not authorized")

        token = auth_header.split('Bearer ')[1]
        try:
            payload = jwt.decode(token, 'secret', algorithms=["HS256"])
            image = UserImage.objects.filter(user=payload['id'])
            serializer = ImageSerializer(image, many=True)
            return Response(serializer.data)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Not authorized")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
    def post(self, request, *args, **kwargs):
        posts_serializer = ImageSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserLogout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        
        return response

        