"""add unique lower index to users and clients

Revision ID: 78eaa03ab4b2
Revises: be424d650463
Create Date: 2025-06-05 14:08:58.140709

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '78eaa03ab4b2'
down_revision: Union[str, None] = 'be424d650463'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comments', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False))
    op.drop_column('comments', 'ccreated_at')
    op.execute(
        "CREATE UNIQUE INDEX unique_lower_username ON users (LOWER(username));"
    )
    op.execute(
        "CREATE UNIQUE INDEX unique_lower_client_name ON clients (LOWER(name));"
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comments', sa.Column('ccreated_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False))
    op.drop_column('comments', 'created_at')
    # ### end Alembic commands ###
