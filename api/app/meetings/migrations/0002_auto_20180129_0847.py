# Generated by Django 2.0.1 on 2018-01-29 08:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app_users', '0001_initial'),
        ('meetings', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AgendaItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PENDING', 'PENDING'), ('OPEN', 'OPEN'), ('CLOSED', 'CLOSED'), ('REJECTED', 'REJECTED')], default='PENDING', max_length=10, verbose_name='self')),
                ('title', models.CharField(max_length=500)),
                ('body', models.CharField(max_length=5000)),
                ('allotted_duration', models.PositiveIntegerField(default=0)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('opened_on', models.DateTimeField(blank=True, null=True)),
                ('closed_on', models.DateTimeField(blank=True, null=True)),
                ('version', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='AgendaItemComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('agenda_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.AgendaItem')),
            ],
        ),
        migrations.CreateModel(
            name='AgendaItemVote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('agenda_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.AgendaItem')),
                ('vote', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.Vote')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.CharField(blank=True, max_length=5000)),
                ('version', models.PositiveIntegerField(default=0)),
                ('created_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_on', models.DateTimeField(auto_now=True, null=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_users.AppUser')),
            ],
        ),
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500)),
                ('allotted_duration', models.PositiveIntegerField(default=0)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('started_on', models.DateTimeField(blank=True, null=True)),
                ('ended_on', models.DateTimeField(blank=True, null=True)),
                ('version', models.PositiveIntegerField(default=0)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_users.AppUser')),
            ],
        ),
        migrations.AddField(
            model_name='agendaitemcomment',
            name='comment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.Comment'),
        ),
        migrations.AddField(
            model_name='agendaitem',
            name='meeting',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.Meeting'),
        ),
        migrations.AddField(
            model_name='agendaitem',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_users.AppUser'),
        ),
    ]