# Generated by Django 2.0.1 on 2018-02-01 09:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app_users', '0003_auto_20180201_0230'),
        ('meetings', '0005_agendaitemvote'),
    ]

    operations = [
        migrations.CreateModel(
            name='MeetingInvitation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PENDING', 'PENDING'), ('ACCEPTED', 'ACCEPTED'), ('REJECTED', 'REJECTED')], default='PENDING', max_length=10)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('accepted_on', models.DateTimeField()),
                ('rejected_on', models.DateTimeField(blank=True, null=True)),
                ('version', models.PositiveIntegerField(default=0)),
                ('invitee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitee', to='app_users.AppUser')),
                ('inviter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inviter', to='app_users.AppUser')),
                ('meeting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.Meeting')),
            ],
        ),
        migrations.CreateModel(
            name='MeetingParticipant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PRESENT', 'PRESENT'), ('ABSENT', 'ABSENT')], default='ABSENT', max_length=10)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('joined_on', models.DateTimeField()),
                ('left_on', models.DateTimeField(blank=True, null=True)),
                ('version', models.PositiveIntegerField(default=0)),
                ('app_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_users.AppUser')),
                ('meeting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.Meeting')),
            ],
        ),
    ]