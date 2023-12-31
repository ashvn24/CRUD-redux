from django.db import models
from django.contrib.auth.models import AbstractUser,AbstractBaseUser,PermissionsMixin
from .manager import CustomUserManager
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email_address'), unique=True)
    phone = models.CharField(help_text='Contact phone number', unique=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
   
    
    def __str__(self):
        return self.first_name

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()
    
class UserImage(models.Model):
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.email