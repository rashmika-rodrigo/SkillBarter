from django.contrib import admin
from .models import User, Skill, SwapRequest

# Register the models.
admin.site.register(User)
admin.site.register(Skill)
admin.site.register(SwapRequest)