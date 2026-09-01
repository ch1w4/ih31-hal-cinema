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
    ('大スクリーン2', 'large'),
    ('大スクリーン3', 'large'),
    ('中スクリーン1', 'medium'),
    ('中スクリーン2', 'medium'),
    ('小スクリーン1', 'small'),
    ('小スクリーン2', 'small'),
    ('小スクリーン3', 'small')
ON CONFLICT DO NOTHING;

-- 座席生成（大×3: A-C/16席 + D-I/13席、中×2: A-H/15席、小×3: A-G/10席）
DO $$
DECLARE
    s_id BIGINT;
    r    TEXT;
    c    INTEGER;
    sname TEXT;
BEGIN
    -- 大スクリーン 3本
    FOREACH sname IN ARRAY ARRAY['大スクリーン1','大スクリーン2','大スクリーン3'] LOOP
        SELECT screen_id INTO s_id FROM screens WHERE name = sname LIMIT 1;
        FOREACH r IN ARRAY ARRAY['A','B','C'] LOOP
            FOR c IN 1..16 LOOP
                INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c) ON CONFLICT DO NOTHING;
            END LOOP;
        END LOOP;
        FOREACH r IN ARRAY ARRAY['D','E','F','G','H','I'] LOOP
            FOR c IN 1..13 LOOP
                INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c) ON CONFLICT DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;

    -- 中スクリーン 2本
    FOREACH sname IN ARRAY ARRAY['中スクリーン1','中スクリーン2'] LOOP
        SELECT screen_id INTO s_id FROM screens WHERE name = sname LIMIT 1;
        FOREACH r IN ARRAY ARRAY['A','B','C','D','E','F','G','H'] LOOP
            FOR c IN 1..15 LOOP
                INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c) ON CONFLICT DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;

    -- 小スクリーン 3本
    FOREACH sname IN ARRAY ARRAY['小スクリーン1','小スクリーン2','小スクリーン3'] LOOP
        SELECT screen_id INTO s_id FROM screens WHERE name = sname LIMIT 1;
        FOREACH r IN ARRAY ARRAY['A','B','C','D','E','F','G'] LOOP
            FOR c IN 1..10 LOOP
                INSERT INTO seats (screen_id, seat_row, seat_col) VALUES (s_id, r, c) ON CONFLICT DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- ジャンル
INSERT INTO genres (name) VALUES
    ('アクション'), ('ドラマ'), ('SF'), ('ホラー'), ('ロマンス'),
    ('コメディ'), ('アニメ'), ('ドキュメンタリー'), ('ミステリー'), ('ファンタジー')
ON CONFLICT DO NOTHING;
