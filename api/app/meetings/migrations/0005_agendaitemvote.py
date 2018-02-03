# Generated by Django 2.0.1 on 2018-01-31 07:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app_users', '0001_initial'),
        ('meetings', '0004_auto_20180131_0717'),
    ]

    operations = [
        migrations.CreateModel(
            name='AgendaItemVote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vote_type', models.CharField(choices=[('up', 'up'), ('down', 'down'), ('meh', 'meh')], max_length=10)),
                ('prev_vote_type', models.CharField(blank=True, choices=[('up', 'up'), ('down', 'down'), ('meh', 'meh')], max_length=10, null=True)),
                ('version', models.PositiveIntegerField(default=0)),
                ('created_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_on', models.DateTimeField(auto_now=True, null=True)),
                ('agenda_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings.AgendaItem')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_users.AppUser')),
            ],
        ),
    ]
