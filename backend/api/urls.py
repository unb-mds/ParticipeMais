from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import *

#URLs para o app usuarios
urlpatterns = [
    
    path('', HomeView.as_view(), name='home_page'),
    path('api/listar', ListarUsuario.as_view(), name='listar_usuarios'), #listas usuários
    path('api/cadastro/', CadastroView.as_view()),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    

    path('api/forgotpassword/', RequestEmail.as_view(), name="request_email"),
    path('api/forgotpassword/confirmtoken/<uidb64>/<token>', CheckToken.as_view(), name="check_token"),
    path('api/forgotpassword/setnewpassword/<uidb64>/<token>', SetNewPassword.as_view(), name='set_new_password'),
]

# Documentação
# as_view() converte a classe em uma função que o Django pode chamar quando a rota for acessada

