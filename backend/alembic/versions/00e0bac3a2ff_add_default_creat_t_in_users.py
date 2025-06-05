"""add default creat_t in users

Revision ID: 00e0bac3a2ff
Revises: 202726be273f
Create Date: 2025-05-29 10:49:59.934870

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '00e0bac3a2ff'
down_revision: Union[str, None] = '202726be273f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Agregar default explícitamente
    op.alter_column('users', 'created_at',
        existing_type=sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text('NOW()')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'created_at',
        existing_type=sa.DateTime(timezone=True),
        nullable=True,
        server_default=None
    )
