"""remove unique constraint from client email

Revision ID: cbf57dd16065
Revises: f1d184e13320
Create Date: 2025-05-15 17:03:21.830860

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cbf57dd16065'
down_revision: Union[str, None] = 'f1d184e13320'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_clients_email', table_name='clients')
    op.create_index(op.f('ix_clients_email'), 'clients', ['email'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_clients_email'), table_name='clients')
    op.create_index('ix_clients_email', 'clients', ['email'], unique=True)
    # ### end Alembic commands ###
