from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from usuarios.views import CadastroView, HomeView, ListarUsuario


#URLs para o app usuarios
urlpatterns = [
  
    path('', ListarUsuario.as_view(), name='listar_usuarios'),
    path('api/cadastro/', CadastroView.as_view()),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/home/', HomeView.as_view(), name='home_page'),
     
   
]



