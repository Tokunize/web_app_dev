from rest_framework.permissions import IsAuthenticated, AllowAny,BasePermission

class IsAdminPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user_role == "admin":
            return True
        else :  return False
    
class IsAdminOrOwnerPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user_role== 'admin':
            return True
        if request.user_role == 'owner':
            return True
        return False
