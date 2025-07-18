# Generated by Django 5.2.1 on 2025-06-20 21:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pergunta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pergunta', models.TextField()),
                ('categoria', models.CharField(max_length=100)),
                ('tipo', models.CharField(choices=[('simnao', 'Sim ou Não'), ('multipla', 'Múltipla Escolha')], max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='PerguntaMultipla',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pergunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='multipla_escolha', to='api.pergunta')),
            ],
        ),
        migrations.CreateModel(
            name='Alternativa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conteudo', models.CharField(max_length=255)),
                ('correta', models.BooleanField(default=False)),
                ('pergunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alternativas', to='api.perguntamultipla')),
            ],
        ),
        migrations.CreateModel(
            name='PerguntaSimNao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('resposta_correta', models.BooleanField(blank=True, null=True)),
                ('pergunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pergunta_sim_nao', to='api.pergunta')),
            ],
        ),
    ]
