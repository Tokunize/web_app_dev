from rest_framework import permissions

class CanViewProperty(permissions.BasePermission):
    """
    Permite a los usuarios ver propiedades si tienen el permiso 'view_property'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('property.view_property')

class CanUploadProperty(permissions.BasePermission):
    """
    Permite a los usuarios crear propiedades si tienen el permiso 'upload_property'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('property.upload_property')