# Generated by Django 5.2.1 on 2025-06-23 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conferencias', '0003_alter_agenda_conferencia_alter_agenda_etapa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conferencia',
            name='data_subconferencia',
            field=models.TextField(blank=True, null=True),
        ),
    ]
