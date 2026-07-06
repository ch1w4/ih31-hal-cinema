-- =============================================
-- HAL CINEMA シードデータ
-- =============================================

-- 券種
INSERT INTO ticket_types (name, unit_price) VALUES
    ('一般',       1900),
    ('大学生・専門', 1500),
    ('シニア',     1200),
    ('小学生以下',  1000)
ON CONFLICT DO NOTHING;

-- スクリーン
INSERT INTO screens (name, screen_type) VALUES
    ('大スクリーン1', 'large'),
    ('中スクリーン1', 'medium'),
    ('小スクリーン1', 'small')
ON CONFLICT DO NOTHING;

-- 大スクリーン1（200席）: A〜C列各16席、D〜I列各13席
-- ※ テーブル定義書のシート構成に準拠

-- 大スクリーン1 の座席（screen_id=1 前提、実際は RETURNING id で取得する）
DO $$
DECLARE
    s_id BIGINT;
    r    TEXT;
    c    INTEGER;
BEGIN
    SELECT screen_id INTO s_id FROM screens WHERE name = '大スクリーン1' LIMIT 1;

    -- A〜C列: 各16席
    FOREACH r IN ARRAY ARRAY['A','B','C'] LOOP
        FOR c IN 1..16 LOOP
            INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

    -- D〜I列: 各13席
    FOREACH r IN ARRAY ARRAY['D','E','F','G','H','I'] LOOP
        FOR c IN 1..13 LOOP
            INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 中スクリーン1 の座席（A〜H列 各15席）
DO $$
DECLARE
    s_id BIGINT;
    r    TEXT;
    c    INTEGER;
BEGIN
    SELECT screen_id INTO s_id FROM screens WHERE name = '中スクリーン1' LIMIT 1;

    FOREACH r IN ARRAY ARRAY['A','B','C','D','E','F','G','H'] LOOP
        FOR c IN 1..15 LOOP
            INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 小スクリーン1 の座席（A〜G列 各10席）
DO $$
DECLARE
    s_id BIGINT;
    r    TEXT;
    c    INTEGER;
BEGIN
    SELECT screen_id INTO s_id FROM screens WHERE name = '小スクリーン1' LIMIT 1;

    FOREACH r IN ARRAY ARRAY['A','B','C','D','E','F','G'] LOOP
        FOR c IN 1..10 LOOP
            INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- ジャンル
INSERT INTO genres (name) VALUES
    ('アクション'), ('ドラマ'), ('SF'), ('ホラー'), ('ロマンス'),
    ('コメディ'), ('アニメ'), ('ドキュメンタリー'), ('ミステリー'), ('ファンタジー')
ON CONFLICT DO NOTHING;
