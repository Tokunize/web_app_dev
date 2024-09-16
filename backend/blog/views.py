from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

class ArticleListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PublicArticleListView(APIView):
    permission_classes = [AllowAny]  
    def get(self, request):
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SingleArticleView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({"detail": "Article not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ArticleSerializer(article)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class DeleteArticleView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return None

    def delete(self, request, pk):
        article = self.get_object(pk)
        if article is None:
            return Response({"detail": "Article not found."}, status=status.HTTP_404_NOT_FOUND)

        article.delete()
        return Response({"detail": "Article deleted."}, status=status.HTTP_204_NO_CONTENT)
    
class EditArticleView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return None

    def put(self, request, pk):
        article = self.get_object(pk)
        if article is None:
            return Response({"detail": "Article not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ArticleSerializer(article, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   