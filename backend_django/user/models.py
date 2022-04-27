from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email),
            username=username
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email,
            password=password,
            username=username,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):

    email = models.EmailField(
        verbose_name="user's email",
        max_length=255,
        unique=True
    )
    user_profile = models.ImageField(
        verbose_name="user's profile path",
        default="default.jpg",
        blank=True,
        upload_to=""
    )
    username = models.CharField(
        verbose_name="user's name",
        max_length=20,
        blank=False,
        unique=True,
        default=''
    )
    first_name = models.CharField(
        max_length=5,
        blank=True,
        default=""
    )
    last_name = models.CharField(
        max_length=5,
        blank=True,
        default=""
    )
    user_sign_up_date = models.DateTimeField(
        verbose_name="user's Date and time of membership",
        auto_now_add=True
    )
    user_access_date = models.DateTimeField(
        verbose_name="user's Last login date",
        auto_now=True
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    class Meta:
        ordering = ['id']
        db_table = 'user'

class Directory(models.Model):
    dr_id = models.AutoField(
        verbose_name="directory's ID",
        primary_key=True,
    )
    user_id = models.ForeignKey(
        "User",
        related_name="user",
        on_delete=models.CASCADE,
        db_column="user_id"
    )
    dr_name = models.CharField(
        verbose_name="directory's name",
        max_length=10,
    )
    dr_pid = models.IntegerField(
        verbose_name="directory's parent ID",
        null=True
    )

    class Meta:
        db_table = 'directory'