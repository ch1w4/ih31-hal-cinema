from datetime import date, datetime, time
from typing import Optional, List
from sqlalchemy import (
    BigInteger, Boolean, Date, ForeignKey, Integer, String, Text, Time,
    Timestamp, UniqueConstraint, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


# ──────────────────────────────────────────────
# 映画・コンテンツ系
# ──────────────────────────────────────────────

class Genre(Base):
    __tablename__ = "genres"

    genre_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name:     Mapped[str] = mapped_column(String(50), nullable=False, unique=True)

    movies: Mapped[List["MovieGenre"]] = relationship(back_populates="genre")


class CastMember(Base):
    __tablename__ = "cast_members"

    cast_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name:    Mapped[str] = mapped_column(String(100), nullable=False)

    movies: Mapped[List["MovieCast"]] = relationship(back_populates="cast_member")


class Movie(Base):
    __tablename__ = "movies"

    movie_id:     Mapped[int]           = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title:        Mapped[str]           = mapped_column(String(255), nullable=False)
    title_en:     Mapped[Optional[str]] = mapped_column(String(255))
    synopsis:     Mapped[Optional[str]] = mapped_column(Text)
    duration:     Mapped[Optional[int]] = mapped_column(Integer)       # 分
    rating:       Mapped[Optional[str]] = mapped_column(String(10))    # G/PG12/R15+/R18+
    director:     Mapped[Optional[str]] = mapped_column(String(100))
    release_date: Mapped[Optional[date]] = mapped_column(Date)
    end_date:     Mapped[Optional[date]] = mapped_column(Date)
    poster_path:  Mapped[Optional[str]] = mapped_column(String(255))
    poster_color: Mapped[Optional[str]] = mapped_column(String(20))
    ranking:      Mapped[Optional[int]] = mapped_column(Integer)

    genres:   Mapped[List["MovieGenre"]] = relationship(back_populates="movie", cascade="all, delete-orphan")
    casts:    Mapped[List["MovieCast"]]  = relationship(back_populates="movie", cascade="all, delete-orphan")
    showings: Mapped[List["Showing"]]    = relationship(back_populates="movie")
    likes:    Mapped[List["Like"]]       = relationship(back_populates="movie")


class MovieGenre(Base):
    __tablename__ = "movie_genres"
    __table_args__ = (UniqueConstraint("movie_id", "genre_id"),)

    movie_genre_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    movie_id:       Mapped[int] = mapped_column(BigInteger, ForeignKey("movies.movie_id"), nullable=False)
    genre_id:       Mapped[int] = mapped_column(BigInteger, ForeignKey("genres.genre_id"), nullable=False)

    movie: Mapped["Movie"] = relationship(back_populates="genres")
    genre: Mapped["Genre"] = relationship(back_populates="movies")


class MovieCast(Base):
    __tablename__ = "movie_casts"
    __table_args__ = (UniqueConstraint("movie_id", "cast_id"),)

    movie_cast_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    movie_id:      Mapped[int] = mapped_column(BigInteger, ForeignKey("movies.movie_id"), nullable=False)
    cast_id:       Mapped[int] = mapped_column(BigInteger, ForeignKey("cast_members.cast_id"), nullable=False)

    movie:       Mapped["Movie"]      = relationship(back_populates="casts")
    cast_member: Mapped["CastMember"] = relationship(back_populates="movies")


# ──────────────────────────────────────────────
# スクリーン・座席
# ──────────────────────────────────────────────

class Screen(Base):
    __tablename__ = "screens"

    screen_id:   Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name:        Mapped[str] = mapped_column(String(50), nullable=False)
    screen_type: Mapped[str] = mapped_column(String(10), nullable=False)  # large/medium/small

    seats:    Mapped[List["Seat"]]    = relationship(back_populates="screen")
    showings: Mapped[List["Showing"]] = relationship(back_populates="screen")


class Seat(Base):
    __tablename__ = "seats"
    __table_args__ = (UniqueConstraint("screen_id", "seat_row", "seat_col"),)

    seat_id:   Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    screen_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("screens.screen_id"), nullable=False)
    seat_row:  Mapped[str] = mapped_column(String(2), nullable=False)
    seat_col:  Mapped[int] = mapped_column(Integer, nullable=False)

    screen:        Mapped["Screen"]           = relationship(back_populates="seats")
    booking_seats: Mapped[List["BookingSeat"]] = relationship(back_populates="seat")


# ──────────────────────────────────────────────
# 上映スケジュール
# ──────────────────────────────────────────────

class Showing(Base):
    __tablename__ = "showings"
    __table_args__ = (UniqueConstraint("screen_id", "show_date", "start_time"),)

    showing_id: Mapped[int]  = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    movie_id:   Mapped[int]  = mapped_column(BigInteger, ForeignKey("movies.movie_id"), nullable=False)
    screen_id:  Mapped[int]  = mapped_column(BigInteger, ForeignKey("screens.screen_id"), nullable=False)
    show_date:  Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)

    movie:         Mapped["Movie"]             = relationship(back_populates="showings")
    screen:        Mapped["Screen"]            = relationship(back_populates="showings")
    bookings:      Mapped[List["Booking"]]     = relationship(back_populates="showing")
    booking_seats: Mapped[List["BookingSeat"]] = relationship(back_populates="showing")


# ──────────────────────────────────────────────
# 会員
# ──────────────────────────────────────────────

class Member(Base):
    __tablename__ = "members"

    member_id:       Mapped[int]             = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email:           Mapped[str]             = mapped_column(String(255), nullable=False, unique=True)
    password_hash:   Mapped[Optional[str]]   = mapped_column(String(255))  # OAuth会員はNULL
    last_name:       Mapped[str]             = mapped_column(String(50), nullable=False)
    first_name:      Mapped[str]             = mapped_column(String(50), nullable=False)
    last_name_kana:  Mapped[Optional[str]]   = mapped_column(String(50))
    first_name_kana: Mapped[Optional[str]]   = mapped_column(String(50))
    gender:          Mapped[Optional[str]]   = mapped_column(String(10))   # male/female/other
    phone:           Mapped[Optional[str]]   = mapped_column(String(20))
    auth_provider:   Mapped[str]             = mapped_column(String(20), nullable=False, default="local")
    created_at:      Mapped[datetime]        = mapped_column(Timestamp, nullable=False, server_default=func.now())
    age:             Mapped[Optional[str]]   = mapped_column(String(3))

    bookings:           Mapped[List["Booking"]]          = relationship(back_populates="member")
    likes:              Mapped[List["Like"]]              = relationship(back_populates="user")
    point_transactions: Mapped[List["PointTransaction"]] = relationship(back_populates="member")
    notifications:      Mapped[List["Notification"]]     = relationship(back_populates="member")


# ──────────────────────────────────────────────
# 好き（AIスコア）
# ──────────────────────────────────────────────

class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("user_id", "movie_id"),)

    like_id:  Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id:  Mapped[int] = mapped_column(BigInteger, ForeignKey("members.member_id"), nullable=False)
    movie_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("movies.movie_id"), nullable=False)
    score:    Mapped[int] = mapped_column(Integer, nullable=False)

    user:  Mapped["Member"] = relationship(back_populates="likes")
    movie: Mapped["Movie"]  = relationship(back_populates="likes")


# ──────────────────────────────────────────────
# 予約
# ──────────────────────────────────────────────

class Coupon(Base):
    __tablename__ = "coupons"

    coupon_id:      Mapped[int]           = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    code:           Mapped[str]           = mapped_column(String(30), nullable=False, unique=True)
    discount_type:  Mapped[str]           = mapped_column(String(10), nullable=False)  # amount/rate
    discount_value: Mapped[int]           = mapped_column(Integer, nullable=False)
    max_uses:       Mapped[Optional[int]] = mapped_column(Integer)                     # NULL=無制限
    expires_at:     Mapped[Optional[date]] = mapped_column(Date)

    bookings: Mapped[List["Booking"]] = relationship(back_populates="coupon")


class TicketType(Base):
    __tablename__ = "ticket_types"

    ticket_type_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name:           Mapped[str] = mapped_column(String(50), nullable=False)
    unit_price:     Mapped[int] = mapped_column(Integer, nullable=False)

    booking_seats: Mapped[List["BookingSeat"]] = relationship(back_populates="ticket_type")


class Booking(Base):
    __tablename__ = "bookings"

    booking_id: Mapped[int]              = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    member_id:  Mapped[Optional[int]]    = mapped_column(BigInteger, ForeignKey("members.member_id"))  # ゲストはNULL
    showing_id: Mapped[int]              = mapped_column(BigInteger, ForeignKey("showings.showing_id"), nullable=False)
    coupon_id:  Mapped[Optional[int]]    = mapped_column(BigInteger, ForeignKey("coupons.coupon_id"))
    booking_no: Mapped[str]              = mapped_column(String(20), nullable=False, unique=True)
    booked_at:  Mapped[datetime]         = mapped_column(Timestamp, nullable=False, server_default=func.now())
    status:     Mapped[str]              = mapped_column(String(20), nullable=False, default="pending")  # pending/confirmed/cancelled
    expires_at: Mapped[Optional[datetime]] = mapped_column(Timestamp)  # 仮予約TTL

    member:        Mapped[Optional["Member"]]   = relationship(back_populates="bookings")
    showing:       Mapped["Showing"]            = relationship(back_populates="bookings")
    coupon:        Mapped[Optional["Coupon"]]   = relationship(back_populates="bookings")
    booking_seats: Mapped[List["BookingSeat"]]  = relationship(back_populates="booking", cascade="all, delete-orphan")
    payment:       Mapped[Optional["Payment"]]  = relationship(back_populates="booking", uselist=False)
    point_transactions: Mapped[List["PointTransaction"]] = relationship(back_populates="booking")
    notifications:      Mapped[List["Notification"]]     = relationship(back_populates="booking")


class BookingSeat(Base):
    __tablename__ = "booking_seats"
    __table_args__ = (UniqueConstraint("showing_id", "seat_id"),)  # 二重予約防止

    booking_seat_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    booking_id:      Mapped[int] = mapped_column(BigInteger, ForeignKey("bookings.booking_id"), nullable=False)
    showing_id:      Mapped[int] = mapped_column(BigInteger, ForeignKey("showings.showing_id"), nullable=False)
    seat_id:         Mapped[int] = mapped_column(BigInteger, ForeignKey("seats.seat_id"), nullable=False)
    ticket_type_id:  Mapped[int] = mapped_column(BigInteger, ForeignKey("ticket_types.ticket_type_id"), nullable=False)
    applied_price:   Mapped[int] = mapped_column(Integer, nullable=False)  # 予約時点の単価

    booking:     Mapped["Booking"]     = relationship(back_populates="booking_seats")
    showing:     Mapped["Showing"]     = relationship(back_populates="booking_seats")
    seat:        Mapped["Seat"]        = relationship(back_populates="booking_seats")
    ticket_type: Mapped["TicketType"]  = relationship(back_populates="booking_seats")
    ticket:      Mapped[Optional["Ticket"]] = relationship(back_populates="booking_seat", uselist=False)


# ──────────────────────────────────────────────
# 支払い・チケット
# ──────────────────────────────────────────────

class Payment(Base):
    __tablename__ = "payments"

    payment_id:     Mapped[int]              = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    booking_id:     Mapped[int]              = mapped_column(BigInteger, ForeignKey("bookings.booking_id"), nullable=False, unique=True)
    method:         Mapped[str]              = mapped_column(String(20), nullable=False)   # credit/emoney/qr
    amount:         Mapped[int]              = mapped_column(Integer, nullable=False)
    status:         Mapped[str]              = mapped_column(String(20), nullable=False, default="unpaid")  # unpaid/paid/refunded/failed
    paid_at:        Mapped[Optional[datetime]] = mapped_column(Timestamp)
    transaction_id: Mapped[Optional[str]]    = mapped_column(String(100))  # Stripe PaymentIntent ID

    booking: Mapped["Booking"] = relationship(back_populates="payment")


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id:       Mapped[int]             = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    booking_seat_id: Mapped[int]             = mapped_column(BigInteger, ForeignKey("booking_seats.booking_seat_id"), nullable=False, unique=True)
    qr_token:        Mapped[str]             = mapped_column(String(64), nullable=False, unique=True)
    status:          Mapped[str]             = mapped_column(String(20), nullable=False, default="unused")  # unused/used
    used_at:         Mapped[Optional[datetime]] = mapped_column(Timestamp)

    booking_seat: Mapped["BookingSeat"] = relationship(back_populates="ticket")


# ──────────────────────────────────────────────
# ポイント・通知・キャンペーン
# ──────────────────────────────────────────────

class PointTransaction(Base):
    __tablename__ = "point_transactions"

    point_tx_id: Mapped[int]             = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    member_id:   Mapped[int]             = mapped_column(BigInteger, ForeignKey("members.member_id"), nullable=False)
    booking_id:  Mapped[Optional[int]]   = mapped_column(BigInteger, ForeignKey("bookings.booking_id"))
    amount:      Mapped[int]             = mapped_column(Integer, nullable=False)  # 正=獲得 / 負=利用
    tx_type:     Mapped[str]             = mapped_column(String(20), nullable=False)  # earn/use/expire
    created_at:  Mapped[datetime]        = mapped_column(Timestamp, nullable=False, server_default=func.now())

    member:  Mapped["Member"]           = relationship(back_populates="point_transactions")
    booking: Mapped[Optional["Booking"]] = relationship(back_populates="point_transactions")


class Notification(Base):
    __tablename__ = "notifications"

    notification_id: Mapped[int]             = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    member_id:       Mapped[int]             = mapped_column(BigInteger, ForeignKey("members.member_id"), nullable=False)
    booking_id:      Mapped[Optional[int]]   = mapped_column(BigInteger, ForeignKey("bookings.booking_id"))
    type:            Mapped[str]             = mapped_column(String(20), nullable=False)  # confirm/reminder/cancel
    body:            Mapped[str]             = mapped_column(Text, nullable=False)
    sent_at:         Mapped[Optional[datetime]] = mapped_column(Timestamp)
    is_read:         Mapped[bool]            = mapped_column(Boolean, nullable=False, default=False)

    member:  Mapped["Member"]           = relationship(back_populates="notifications")
    booking: Mapped[Optional["Booking"]] = relationship(back_populates="notifications")


class Campaign(Base):
    __tablename__ = "campaigns"

    campaign_id:  Mapped[int]           = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title:        Mapped[str]           = mapped_column(String(255), nullable=False)
    subtitle:     Mapped[Optional[str]] = mapped_column(String(255))
    description:  Mapped[Optional[str]] = mapped_column(Text)         # 一覧表示用短文
    body:         Mapped[Optional[str]] = mapped_column(Text)
    period:       Mapped[Optional[str]] = mapped_column(String(100))
    category:     Mapped[str]           = mapped_column(String(20), nullable=False)
    image_path:   Mapped[Optional[str]] = mapped_column(String(255))
    accent_color: Mapped[Optional[str]] = mapped_column(String(20))
