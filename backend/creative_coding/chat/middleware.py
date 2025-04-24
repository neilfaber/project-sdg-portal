from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from users.models import User


@database_sync_to_async
def get_user(token_key):
    try:
        # Verify the token and get the user_id
        access_token = AccessToken(token_key)
        user_id = access_token.payload.get('user_id')
        
        # Get the user from the database
        user = User.objects.get(id=user_id)
        return user
    except (InvalidToken, TokenError, User.DoesNotExist):
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware for JWT authentication with WebSockets
    """
    
    async def __call__(self, scope, receive, send):
        """
        Extract the token from query string and authenticate the user
        """
        # Get the token from query string
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params.get("token", [""])[0]

        if token:
            # Get the user from the token
            scope["user"] = await get_user(token)
        else:
            scope["user"] = AnonymousUser()
            
        return await super().__call__(scope, receive, send) 