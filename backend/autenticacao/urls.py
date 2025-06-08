from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import Login, Logout, CadastroView, RequestEmail, CheckToken, SetNewPassword, NotificationsView

urlpatterns = [
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('cadastro/', CadastroView.as_view(), name='cadastro'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('notifications/', NotificationsView.as_view(), name='notificacoes'),
    
    path('forgotpassword/', RequestEmail.as_view(), name="request_email"),
    path('forgotpassword/confirmtoken/<uidb64>/<token>/', CheckToken.as_view(), name="check_token"),
    path('forgotpassword/setnewpassword/<uidb64>/<token>/', SetNewPassword.as_view(), name="set_new_password"),
]
