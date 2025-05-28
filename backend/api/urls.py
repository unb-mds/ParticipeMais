from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import *

router = DefaultRouter()
router.register(r'pesquisar', PesquisarView, basename='pesquisar')

urlpatterns = [
    
    path('' , Home.as_view(), name='home'),
    path('descubra/', DescubraView.as_view(), name='descubra_page'),
    path('cadastro/', CadastroView.as_view()),
    path('score/', ScoreView.as_view(), name='score'),
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name="logout"),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgotpassword/', RequestEmail.as_view(), name="request_email"),
    path('forgotpassword/confirmtoken/<uidb64>/<token>', CheckToken.as_view(), name="check_token"),
    path('forgotpassword/setnewpassword/<uidb64>/<token>', SetNewPassword.as_view(), name='set_new_password'),
    
]

# Documentação
# as_view() converte a classe em uma função que o Django pode chamar quando a rota for acessada

