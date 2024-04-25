
-- 1. INSERT past study sessions between '938751' and '032759'
INSERT INTO session (topic_id, start_hour, end_hour, date, status) VALUES
(1, 9, 10, CURRENT_DATE - INTERVAL '5 days', 'COMPLETED'),
(3, 15, 16, CURRENT_DATE - INTERVAL '10 days', 'COMPLETED'),
(5, 11, 12, CURRENT_DATE - INTERVAL '7 days', 'COMPLETED'),
(6, 14, 15, CURRENT_DATE - INTERVAL '15 days', 'COMPLETED');

INSERT INTO student_session (session_id, user_id, is_requester) VALUES
((SELECT id FROM session WHERE topic_id = 1 AND start_hour = 9 AND end_hour = 10 AND date = CURRENT_DATE - INTERVAL '5 days'), '938751', TRUE),
((SELECT id FROM session WHERE topic_id = 1 AND start_hour = 9 AND end_hour = 10 AND date = CURRENT_DATE - INTERVAL '5 days'), '032759', FALSE),
((SELECT id FROM session WHERE topic_id = 3 AND start_hour = 15 AND end_hour = 16 AND date = CURRENT_DATE - INTERVAL '10 days'), '938751', TRUE),
((SELECT id FROM session WHERE topic_id = 3 AND start_hour = 15 AND end_hour = 16 AND date = CURRENT_DATE - INTERVAL '10 days'), '032759', FALSE),
((SELECT id FROM session WHERE topic_id = 5 AND start_hour = 11 AND end_hour = 12 AND date = CURRENT_DATE - INTERVAL '7 days'), '938751', TRUE),
((SELECT id FROM session WHERE topic_id = 5 AND start_hour = 11 AND end_hour = 12 AND date = CURRENT_DATE - INTERVAL '7 days'), '032759', FALSE),
((SELECT id FROM session WHERE topic_id = 6 AND start_hour = 14 AND end_hour = 15 AND date = CURRENT_DATE - INTERVAL '15 days'), '938751', TRUE),
((SELECT id FROM session WHERE topic_id = 6 AND start_hour = 14 AND end_hour = 15 AND date = CURRENT_DATE - INTERVAL '15 days'), '032759', FALSE);