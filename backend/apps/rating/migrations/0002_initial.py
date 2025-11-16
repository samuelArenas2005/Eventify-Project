
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('rating', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='rating',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddIndex(
            model_name='rating',
            index=models.Index(fields=['event'], name='rating_event_i_28c668_idx'),
        ),
        migrations.AddIndex(
            model_name='rating',
            index=models.Index(fields=['user'], name='rating_user_id_c76b3e_idx'),
        ),
        migrations.AddConstraint(
            model_name='rating',
            constraint=models.UniqueConstraint(fields=('event', 'user'), name='unique_rating_per_user_event'),
        ),
    ]
