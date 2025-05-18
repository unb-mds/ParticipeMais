from django.urls import path
from .views import CadastroUsuario, ListarUsuario
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


#URLs para o app usuarios
urlpatterns = [
    path('', ListarUsuario.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('cadastro/', CadastroUsuario.as_view()),
]



