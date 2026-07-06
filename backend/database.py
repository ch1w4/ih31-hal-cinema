import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/halcinema"
)

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    """Flask ルートで使う DB セッション（with ブロックで使用）"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """起動時にテーブルを作成する（未存在のみ）"""
    from models import Base as ModelBase  # noqa: F401 – import to register mappers
    ModelBase.metadata.create_all(bind=engine)
