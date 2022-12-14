# Generated by Django 4.1.2 on 2023-01-10 08:59

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_modellist_modellistsetting_modellist_templates'),
    ]

    operations = [
        migrations.CreateModel(
            name='TemplateOwner',
            fields=[
                ('id', models.BigAutoField(editable=False, primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=50, verbose_name='name')),
            ],
            options={
                'verbose_name': 'template owner',
                'verbose_name_plural': 'templates owner',
            },
        ),
        migrations.AlterField(
            model_name='user',
            name='is_management',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name='template',
            name='template_owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.templateowner', verbose_name='template owner'),
        ),
    ]
