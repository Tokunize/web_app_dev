# Generated by Django 4.2.15 on 2024-09-02 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0002_property_created_at_property_updated_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='TokensTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event', models.CharField(choices=[('BUY', 'Buy'), ('SELL', 'Sell'), ('CANCELLATION', 'Cancellation')], max_length=20)),
                ('transaction_price', models.DecimalField(decimal_places=2, help_text='the price of the transaction, the sum of all the tokens price involved ', max_digits=10)),
                ('tokens_quantity', models.PositiveIntegerField(help_text='number of tokens per transaction')),
                ('transaction_owner', models.CharField(default='0x358V948499shd7smw424dcg', help_text='Blockchain address of the user who made the transaction.', max_length=255)),
            ],
            options={
                'verbose_name': 'Token Transaction',
                'verbose_name_plural': 'Token Transactions',
            },
        ),
        migrations.AddField(
            model_name='property',
            name='active',
            field=models.BooleanField(blank=True, help_text="A boolean to control if the property is listed or if it's a comming soon property", null=True),
        ),
    ]
