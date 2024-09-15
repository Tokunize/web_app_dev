from django.db.models import Sum
from property.models import Transaction, PropertyToken

def get_total_invested(user):
    total_invested = Transaction.objects.filter(transaction_owner_code=user).aggregate(total_invested=Sum('transaction_amount'))
    return total_invested['total_invested'] or 0

def get_total_tokens_owned(user):
    total_tokens_owned = PropertyToken.objects.filter(owner_user_code=user).aggregate(total_tokens=Sum('number_of_tokens'))
    return total_tokens_owned['total_tokens'] or 0
