from django.contrib import admin
from .models import CustomUser, InvestorProfile, PropertyOwnerProfile

class InvestorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_sub', 'total_investment')
    search_fields = ('user__email', 'user__sub')

    def user_sub(self, obj):
        return obj.user.sub
    user_sub.admin_order_field = 'user__sub'  
    user_sub.short_description = 'User Sub'  

class PropertyOwnerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'number_of_properties')
    search_fields = ('user__email',)

admin.site.register(InvestorProfile, InvestorProfileAdmin)
admin.site.register(PropertyOwnerProfile, PropertyOwnerProfileAdmin)
