use commenter;

desc user_info;

SELECT * FROM user_info order by user_id DESC limit 1;
SELECT COUNT(*) FROM user_info;

DELETE FROM user_info WHERE user_id = 'UI0000000051';

DELETE from login_token;
SELECT * FROM login_token;

insert 
	user_info (user_id, nickname, n_token)
values
	('UI0000000001', 'nn1', 'n_token1')
	, ('UI0000000002', 'nn2', 'n_token2')
	, ('UI0000000003', 'nn3', 'n_token3')
	, ('UI0000000004', 'nn4', 'n_token4')
	, ('UI0000000005', 'nn5', 'n_token5')
	, ('UI0000000006', 'nn6', 'n_token6')
	, ('UI0000000007', 'nn7', 'n_token7')
	, ('UI0000000008', 'nn8', 'n_token8')
	, ('UI0000000009', 'nn9', 'n_token9')
	, ('UI0000000010', 'nn10', 'n_token10')
	, ('UI0000000011', 'nn11', 'n_token11')
	, ('UI0000000012', 'nn12', 'n_token12')
	, ('UI0000000013', 'nn13', 'n_token13')
	, ('UI0000000014', 'nn14', 'n_token14')
	, ('UI0000000015', 'nn15', 'n_token15')
	, ('UI0000000016', 'nn16', 'n_token16')
	, ('UI0000000017', 'nn17', 'n_token17')
	, ('UI0000000018', 'nn18', 'n_token18')
	, ('UI0000000019', 'nn19', 'n_token19')
	, ('UI0000000020', 'nn20', 'n_token20')
	, ('UI0000000021', 'nn21', 'n_token21')
	, ('UI0000000022', 'nn22', 'n_token22')
	, ('UI0000000023', 'nn23', 'n_token23')
	, ('UI0000000024', 'nn24', 'n_token24')
	, ('UI0000000025', 'nn25', 'n_token25')
	, ('UI0000000026', 'nn26', 'n_token26')
	, ('UI0000000027', 'nn27', 'n_token27')
	, ('UI0000000028', 'nn28', 'n_token28')
	, ('UI0000000029', 'nn29', 'n_token29')
	, ('UI0000000030', 'nn30', 'n_token30')
	, ('UI0000000031', 'nn31', 'n_token31')
	, ('UI0000000032', 'nn32', 'n_token32')
	, ('UI0000000033', 'nn33', 'n_token33')
	, ('UI0000000034', 'nn34', 'n_token34')
	, ('UI0000000035', 'nn35', 'n_token35')
	, ('UI0000000036', 'nn36', 'n_token36')
	, ('UI0000000037', 'nn37', 'n_token37')
	, ('UI0000000038', 'nn38', 'n_token38')
	, ('UI0000000039', 'nn39', 'n_token39')
	, ('UI0000000040', 'nn40', 'n_token40')
	, ('UI0000000041', 'nn41', 'n_token41')
	, ('UI0000000042', 'nn42', 'n_token42')
	, ('UI0000000043', 'nn43', 'n_token43')
	, ('UI0000000044', 'nn44', 'n_token44')
	, ('UI0000000045', 'nn45', 'n_token45')
	, ('UI0000000046', 'nn46', 'n_token46')
	, ('UI0000000047', 'nn47', 'n_token47')
	, ('UI0000000048', 'nn48', 'n_token48')
	, ('UI0000000049', 'nn49', 'n_token49')
	, ('UI0000000050', 'nn50', 'n_token50')
	, ('UI0000000051', 'nn51', 'n_token51')
	, ('UI0000000052', 'nn52', 'n_token52')
	, ('UI0000000053', 'nn53', 'n_token53')
	, ('UI0000000054', 'nn54', 'n_token54')
	, ('UI0000000055', 'nn55', 'n_token55')
	, ('UI0000000056', 'nn56', 'n_token56')
	, ('UI0000000057', 'nn57', 'n_token57')
	, ('UI0000000058', 'nn58', 'n_token58')
	, ('UI0000000059', 'nn59', 'n_token59')
	, ('UI0000000060', 'nn60', 'n_token60');