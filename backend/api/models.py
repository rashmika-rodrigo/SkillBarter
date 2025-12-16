from django.db import models
from django.contrib.auth.models import AbstractUser

# The User (Extends default Django user)
class User(AbstractUser):
    # inherit username, password, email
    bio = models.TextField(blank=True, default="")
    location = models.CharField(max_length=100, blank=True, default="")
    karma_credits = models.IntegerField(default=5) # Start with 5 credits
    
    def __str__(self):
        return self.username
    

# The Skill (What users Offer or Need)
class Skill(models.Model):
    SKILL_TYPES = (
        ('TEACH', 'I can Teach'),
        ('LEARN', 'I want to Learn'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="skills")
    title = models.CharField(max_length=200) 
    description = models.TextField()
    category = models.CharField(max_length=10, choices=SKILL_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_category_display()}: {self.title}"
    

# The Swap Request (The Transaction)
class SwapRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('COMPLETED', 'Completed'),
        ('REJECTED', 'Rejected'),
    )
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_swaps")
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_swaps")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    message = models.TextField(default="Hello! I'd like to swap skills with you.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Swap: {self.requester} -> {self.provider} ({self.skill.title})"