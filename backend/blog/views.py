from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics

from .models import Article, DailyVisit,Subscriber
from .serializers import ArticleSerializer,SubscriberSerializer
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import F
from django.http import JsonResponse
import cloudinary.uploader
from django.views.decorators.csrf import csrf_exempt
import json


from datetime import timedelta

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
        DailyVisit.increment_visits()

        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SingleArticleView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            # Use update() with F() expression for safe concurrent updates
            Article.objects.filter(pk=pk).update(views=F('views') + 1)
            
            # Fetch the updated article to serialize
            article = Article.objects.get(pk=pk)
            
            serializer = ArticleSerializer(article)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response({"detail": "Article not found."}, status=status.HTTP_404_NOT_FOUND)

class DeleteArticleView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
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
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WeeklyVisitStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = timezone.now().date()
        start_date = today - timedelta(days=6)  

        visits = DailyVisit.objects.filter(date__range=[start_date, today])
        visit_data = {
            "dates": [visit.date.strftime('%Y-%m-%d') for visit in visits],
            "visits": [visit.visits for visit in visits]
        }

        total_subscribers = Subscriber.objects.all().count()
        subscriber_emails = list(Subscriber.objects.values_list('email', flat=True))


        total_articles = Article.objects.count()

        return Response({
            "visit_data": visit_data,
            "total_articles": total_articles,
            "total_subscribers": total_subscribers,
            "subscriber_emails": subscriber_emails  

        }, status=status.HTTP_200_OK)


@csrf_exempt 
def delete_image(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            public_id = body.get('public_id')

            result = cloudinary.uploader.destroy(public_id)

            if result.get('result') == 'ok':
                return JsonResponse({'success': True, 'message': 'Imagen eliminada correctamente'})
            else:
                return JsonResponse({'success': False, 'message': 'No se pudo eliminar la imagen'}, status=500)

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)



class SubscriberListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]

    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer