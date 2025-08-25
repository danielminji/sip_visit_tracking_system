-- Seed Raub district schools into the schools table
-- Run with: supabase db reset or psql -f this file after deploying schema

begin;

-- Helper: insert if not exists by name + category
create or replace function public.insert_school_if_missing(p_name text, p_category text, p_district text, p_address text, p_contact text)
returns void as $$
begin
  if not exists (select 1 from public.schools s where s.name = p_name and s.category = p_category) then
    insert into public.schools(name, category, district, address, contact)
    values (p_name, p_category, coalesce(p_district,'Raub'), p_address, p_contact);
  end if;
end;
$$ language plpgsql;

-- SK
select insert_school_if_missing('SEKOLAH KEBANGSAAN BANDAR RAUB','SK','Raub','Sekolah Kebangsaaan Bandar Raub, Jalan Lipis, 27600 Raub, Pahang, Malaysia','AHMAD SUKRI BIN SHARKAWI · 0139397615');
select insert_school_if_missing('SEKOLAH KEBANGSAAN ULU GALI','SK','Raub','SG. RUAN, 27500 Raub, Pahang, Malaysia','ZABIDI BIN HARUN · 0133639492');
select insert_school_if_missing('SEKOLAH KEBANGSAAN GALI','SK','Raub','KAMPUNG GALI, 27400 Raub, Pahang, Malaysia','AZARIAH BINTI JALALUDIN · 0179853010');
select insert_school_if_missing('SEKOLAH KEBANGSAAN TANJUNG PUTUS','SK','Raub','KG. TANJUNG PUTUS, 27400 Raub, Pahang, Malaysia','JEFFRI ZAM BIN JAAFAR · 0199494176');
select insert_school_if_missing('SEKOLAH KEBANGSAAN PAMAH KULAT','SK','Raub','KAMPUNG PAMAH KULAT, 27600 Raub, Pahang, Malaysia','S ANEETA BINTI SALEHUDDIN · 0179741140');
select insert_school_if_missing('SEKOLAH KEBANGSAAN ULU DONG','SK','Raub','KAMPUNG PAMAH RAWAS, 27600 Raub, Pahang, Malaysia','FATIMAH BINTI SAIDIN · 01111150799');
select insert_school_if_missing('SEKOLAH KEBANGSAAN MUHAMMAD JABAR','SK','Raub','KM 16, JALAN LIPIS, DONG, 27400 Raub, Pahang, Malaysia','MAISARAH BINTI HAMID · 0197532079');
select insert_school_if_missing('SEKOLAH KEBANGSAAN TEMAU','SK','Raub','KAMPUNG TEMAU, DONG, 27400 Raub, Pahang, Malaysia','ANAS SUKRI BIN MD YUNUS · 0179227672');
select insert_school_if_missing('SEKOLAH KEBANGSAAN KUALA DONG','SK','Raub','JALAN LIPIS, KUALA DONG, 27400 Raub, Pahang, Malaysia','ZAINAB BINTI MAT MIN · 0129977032');
select insert_school_if_missing('SEKOLAH KEBANGSAAN TANJUNG RAJA','SK','Raub','KAMPUNG GESING, 27400 Raub, Pahang, Malaysia','FAZILLAH BT. ABDUL LATIF · 01128006853');
select insert_school_if_missing('SEKOLAH KEBANGSAAN CHENUA','SK','Raub','KG. CHENUA, 27660 Raub, Pahang, Malaysia','AZRAN BIN JAAFAR @ RAMLI · 01151746417');
select insert_school_if_missing('SEKOLAH KEBANGSAAN SEGA','SK','Raub','KM 27, JALAN LIPIS, SEGA, 27660 Raub, Pahang, Malaysia','DZULKARNAIN BIN SUBOH · 0139572829');
select insert_school_if_missing('SEKOLAH KEBANGSAAN KUALA ATOK','SK','Raub','KAMPUNG KUALA ATOK, 27660 Raub, Pahang, Malaysia','SUBRI BIN BASIRON · 0129580508');
select insert_school_if_missing('SEKOLAH KEBANGSAAN ULU ATOK','SK','Raub','KAMPUNG ULU ATOK, 27660 Raub, Pahang, Malaysia','ZAHARUDDIN BIN ZAHID SOFIAN · 0199058597');
select insert_school_if_missing('SEKOLAH KEBANGSAAN SEMANTAN ULU','SK','Raub','KAMPUNG SEMANTAN ULU, 27600 Raub, Pahang, Malaysia','MOHD FAISAL BIN MAT NALI · 0169330500');
select insert_school_if_missing('SEKOLAH KEBANGSAAN KUNDANG PATAH','SK','Raub','KAMPUNG KUNDANG PATAH, 27620 Raub, Pahang, Malaysia','MAT RADI BIN YAACOB · 0179591090');
select insert_school_if_missing('SEKOLAH KEBANGSAAN BATU TALAM','SK','Raub','KAMPUNG BATU TALAM, 27610 Raub, Pahang, Malaysia','ROZITA AYU BINTI NOH · 01119321668');
select insert_school_if_missing('SEKOLAH KEBANGSAAN TERSANG','SK','Raub','KAMPUNG TERSANG, RAUB, Pahang, Malaysia','MOHD RIZAL BIN RAMLI · 0142943014');
select insert_school_if_missing('SEKOLAH KEBANGSAAN ULU SUNGAI','SK','Raub','KAMPUNG ULU SUNGAI, 27610 Raub, Pahang, Malaysia','MOHAMAD SIDIK BIN MOHAMMAD · 0167670917');
select insert_school_if_missing('SEKOLAH KEBANGSAAN (FELDA) LEMBAH KLAU','SK','Raub','FELDA LEMBAH KLAU, 27630 Raub, Pahang, Malaysia','JAHIDIN BIN ABDUL RAHMAN · 0129636192');
select insert_school_if_missing('SEKOLAH KEBANGSAAN LKTP TERSANG SATU','SK','Raub','FELDA TERSANG 1, 27600 Raub, Pahang, Malaysia','ELLY NORDIANA BINTI NOH · 0129220942');
select insert_school_if_missing('SEKOLAH KEBANGSAAN (FELDA) KRAU 1','SK','Raub','JALAN TRAS, 27600 Raub, Pahang, Malaysia','AHMAD NOH BIN IBRAHIM · 0199830806');
select insert_school_if_missing('SEKOLAH KEBANGSAAN (FELDA) TERSANG 3','SK','Raub','FELDA TERSANG 3, 27650 Raub, Pahang, Malaysia','ZAHURI BIN JAMALUDIN · 01112955607');
select insert_school_if_missing('SEKOLAH KEBANGSAAN BUKIT FRASER','SK','Raub','JALAN JERIAU, BUKIT FRASER, 49000 Pahang, Malaysia','ZIKRIL HAKIM BIN RAMLI · 0193451053');
select insert_school_if_missing('SEKOLAH KEBANGSAAN SATAK','SK','Raub','KAMPUNG SATAK, KELA, 27610 Raub, Pahang, Malaysia','AZMAN BIN SUHOR · 0179653969');
select insert_school_if_missing('SEKOLAH KEBANGSAAN RAUB INDAH','SK','Raub','JALAN BENTONG, 27600 Raub, Pahang, Malaysia','SUPIAN BIN AWANG HAMAT · 0138078334');
select insert_school_if_missing('SEKOLAH KEBANGSAAN RAUB JAYA','SK','Raub','JALAN LIPIS, 27600 Raub, Pahang, Malaysia','WAN MUKHTAR BIN WAN ISMAIL · 0139610744');
select insert_school_if_missing('SEKOLAH KEBANGSAAN MAHMUD','SK','Raub','JALAN CHEROH, 27600 Raub, Pahang, Malaysia','MUHAMAD FADZLI BIN HAMZAH · 0139897875');
select insert_school_if_missing('SEKOLAH KEBANGSAAN PEREMPUAN METHODIST','SK','Raub','JALAN CHEROH, 27600 Raub, Pahang, Malaysia','ZULKAFLEE BIN HAMID · 0199675292');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) CHUNG CHING','SK','Raub','JALAN LIPIS, 27600 Raub, Pahang, Malaysia','TAN SIOW YAN · 01110664942');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) SEMPALIT','SK','Raub','KAMPUNG BARU SEMPALIT, 27600 Raub, Pahang, Malaysia','HO SOOK YEE · 0129393763');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) SUNGAI RUAN','SK','Raub','SUNGAI RUAN, 27500 Raub, Pahang, Malaysia','GOH AN NI · 0173871953');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) YUH HWA','SK','Raub','BUKIT KOMAN, 27600 Raub, Pahang, Malaysia','LEE LOKE YIN · 0122190238');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) SG LUI','SK','Raub','KAMPUNG BARU SUNGAI LUI, 27600 Raub, Pahang, Malaysia','WONG MEI TING · 0133936708');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) CHEROH','SK','Raub','KAMPUNG CHEROH, 27620 Raub, Pahang, Malaysia','PUA CHA YIN · 0169212119');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) TRAS','SK','Raub','KAMPUNG TRAS, 27670 Raub, Pahang, Malaysia','CHEE CHOW HAR · 0199489517');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) SG CHETANG','SK','Raub','KAMPUNG SUNGAI CHETANG, 27670 Raub, Pahang, Malaysia','KOH SIEW FONG · 0167318540');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) SANG LEE','SK','Raub','KAMPUNG SANG LEE, 27670 Raub, Pahang, Malaysia','GAN YOKE LAN · 0163266980');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (CINA) SG KLAU','SK','Raub','KAMPUNG SUNGAI KLAU, 27630 Raub, Pahang, Malaysia','CHANG CHEE KEONG · 0169866423');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (TAMIL) RAUB','SK','Raub','JLN TENGKU ABDUL SAMAD, 27600 Raub, Pahang, Malaysia','TAMILVANEN A/L KRISHNAMOORTHY · 0199309608');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (TAMIL) LADANG CHEROH','SK','Raub','LADANG CHEROH, 27620 Raub, Pahang, Malaysia','BALASUBRAMANIAM A/L VELU · 0129454274');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (TAMIL) BUKIT FRASER','SK','Raub','BUKIT FRASER, 49000 Raub, Pahang, Malaysia','SATIA KUMAR A/L KRISHNAN · 01111001359');
select insert_school_if_missing('SEKOLAH JENIS KEBANGSAAN (TAMIL) LADANG GALI','SK','Raub','LADANG GALI, DONG, 27400 Raub, Pahang, Malaysia','V. SUKUNA A/P VARUTHARAJOO · 0199644264');

-- SMK
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN TENGKU KUDIN','SMK','Raub','JALAN CHEROH, 27600 Raub, Pahang, Malaysia','NORAZLIAH BINTI ANI · 01121949192');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN DONG','SMK','Raub','Km 16, Jalan Lipis, Kampung Dong, 27400 Raub, Pahang, Malaysia','TUAN RAHIM BIN TUAN YUSOF · 0129515265');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN LKTP TERSANG','SMK','Raub','FELDA TERSANG 2, 27610 Raub, Pahang, Malaysia','NORAZLIAH BINTI ANI · 0125507095');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN SERI RAUB','SMK','Raub','JALAN SIMPANG KALLANG, 27600 Raub, Pahang, Malaysia','BADRUL HISHAM BIN NOH · 0199826248');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN GALI','SMK','Raub','KM 9, Jalan Kuala Lipis, 27600 Raub, Pahang, Malaysia','MOHAMAD ZULHADZELAN BIN HAMDAN · 0199898685');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN SEGA','SMK','Raub','LOT 4461 & 4462 Mukim Sega, 27660 Raub, Pahang, Malaysia','MUZAINANUIISHAM BIN MOHAMED ISA · 0199220123');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN MAHMUD','SMK','Raub','JALAN TRAS, 27600 Raub, Pahang, Malaysia','SAYED KAMARUDDIN BIN SAYED KADIR · 0199314116');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN DATO SHAHBANDAR HUSSAIN','SMK','Raub','JALAN CHEROH, 27600 Raub, Pahang, Malaysia','MOHD IDHAM SHAHRING BIN AB MANAF · 0125456070');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN (P) METHODIST','SMK','Raub','JALAN CHEROH, 27600 Raub, Pahang, Malaysia','HABIBI BINTI AHMAD · 01110608303');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN CHUNG CHING','SMK','Raub','JALAN PEKELILING, 27600 Raub, Pahang, Malaysia','CHEAM SWEE POH · 0129535120');
select insert_school_if_missing('SEKOLAH MENENGAH KEBANGSAAN SUNGAI RUAN','SMK','Raub','SUNGAI RUAN, 27500 Raub, Pahang, Malaysia','CHOW KWONG MENG · 0199974329');

commit;


