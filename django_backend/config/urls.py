"""
URL Configuration for ILA Global Backend
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/v1/work-study/', include('apps.work_study.urls')),
    path('api/v1/communication-engine/', include('apps.communication_engine.urls')),
    path('api/v1/study-abroad/', include('apps.study_abroad.urls')),
    path('api/v1/job-search/', include('apps.job_search.urls')),
    path('api/v1/rewards-plan/', include('apps.rewards_plan.urls')),
    path('api/v1/intake-tracking/', include('apps.intake_tracking.urls')),
]
