# Generated by Django 5.2.3 on 2025-07-07 02:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultas', '0001_initial'),
        ('propostas', '0006_categoria_remove_propostas_topicos_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='consultas',
            name='categorias',
            field=models.ManyToManyField(blank=True, related_name='consultas', to='propostas.categoria'),
        ),
        migrations.AddField(
            model_name='consultas',
            name='palavras_chaves',
            field=models.CharField(blank=True, default='', max_length=1000),
        ),
    ]
