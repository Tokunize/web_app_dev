from django.urls import path
from .views import(
    ArticleListView,
    SingleArticleView,
    EditArticleView,
    DeleteArticleView,
    PublicArticleListView
)

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='articles-list'),
    path('articles/public/', PublicArticleListView.as_view(), name='articles-list-public'),

    path('articles/<int:pk>/', SingleArticleView.as_view(), name='single-article'),
    path('articles/<int:pk>/edit/', EditArticleView.as_view(), name='article-edit'),
    path('articles/<int:pk>/delete/', DeleteArticleView.as_view(), name='article-delete'),

]