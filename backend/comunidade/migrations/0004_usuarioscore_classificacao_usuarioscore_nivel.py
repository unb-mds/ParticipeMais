# Generated by Django 5.2.1 on 2025-07-08 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comunidade', '0003_alter_chat_autor'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuarioscore',
            name='classificacao',
            field=models.CharField(default='Nível 1: Iniciante Cívico', max_length=100),
        ),
        migrations.AddField(
            model_name='usuarioscore',
            name='nivel',
            field=models.IntegerField(default=1),
        ),
    ]
