# Generated by Django 5.2.1 on 2025-06-16 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('autenticacao', '0001_initial'),
        ('propostas', '0003_propostas_favorito'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='favoritos',
            field=models.ManyToManyField(blank=True, related_name='favoritos', to='propostas.propostas'),
        ),
    ]
