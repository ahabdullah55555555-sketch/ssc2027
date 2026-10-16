/* SSC 2027 original supplied routine (revision 2).
   This file is only the STARTING schedule. After the first launch the app keeps your own copy
   on the device and edits happen inside the app. Nothing here overwrites your edits. */
(function(){
var days=[],tasks=[];
function D(mmdd,planned,note,items,pre){
  var date='2026-'+mmdd.replace('/','-');
  days.push({date:date,planned:planned,note:note||''});
  (items||[]).forEach(function(it,i){
    tasks.push({id:(pre||'r2')+'-'+mmdd.replace('/','')+'-'+i,date:date,subj:it[1]||[],chapter:'',text:it[0],mins:it[2]||null});
  });
}
var BIO='Biology',B='BGS',H='HM',IS='Islam',I='ICT',B1='Bangla 1st',B2='Bangla 2nd',C='Chemistry',E1='Eng 1st',E2='Eng 2nd';
D('10/16',null,'Rest 😴',[]);
D('10/17',240,'',[['Bio 12',[BIO]],['BGS 7',[B]],['HM 12–14 rev',[H]]]);
D('10/18',300,'',[['Bio 13',[BIO]],['BGS 12',[B]],['BGS 13',[B]]]);
D('10/19',360,'',[['Bio 14',[BIO]],['BGS 14',[B]],['BGS 15',[B]],['HM 13–14 practice',[H]]]);
D('10/20',405,'',[['BGS 16',[B]],['Bio 8–10 rev',[BIO]],['Bio 11–12 rev',[BIO]],['Islam 4',[IS]],['Islam 5',[IS]]]);
D('10/21',435,'',[['Bio 13–14 rev',[BIO]],['BGS 7,9–11 rev',[B]],['BGS 12–16 rev',[B]],['HM timed',[H]],['ICT 6',[I]]]);
D('10/22',450,'',[['Bio 9–10 recall',[BIO]],['Bio 11–14 mixed',[BIO]],['HM mixed',[H]],['Bangla 2nd L34–36',[B2]],['L37–38',[B2]],['L43',[B2]]]);
D('10/23',450,'',[['Bangla 2nd L39–42',[B2]],['Bangla 1st B1–2',[B1]],['Bangla 1st B3',[B1]],['ICT 5–6 + Islam 4–5 rev',[I,IS]],['Bio 8–14 full recall',[BIO]],['C10',[C]]]);
D('10/24',450,'',[['Bangla 2nd L29–38 rev',[B2]],['L39–43 rev',[B2]],['Bangla 1st all blocks',[B1]],['Bangla 1st weak parts',[B1]],['Eng 2nd G+C6',[E2]],['Eng 2nd G+C11',[E2]]]);
D('10/25',405,'English 1st only',[['Pattern 6–7',[E1]],['8–9',[E1]],['practice',[E1]],['all-pattern rev',[E1]],['final rev',[E1]]]);
/* Remaining tasks with no date (supplied as "বাকি"/left over). Durations exactly as supplied. */
[['C4, C5, C7, C8, C9, C12',[C],390],['Eng 1st Pattern Practice',[E1],60],['BGS key-point',[B],75],['Bangla 2nd Revision',[B2],60],['ICT + Islam quick',[I,IS],45],['Mistake Lists',[],90],['Weak Chapters Only',[],90],['Bangla 1st + C13',[B1,C],60]]
 .forEach(function(it,i){tasks.push({id:'r2-b-'+i,date:null,subj:it[1],chapter:'',text:it[0],mins:it[2]})});

window.DEFAULT_ROUTINE={
  version:'2026-r2',
  days:days,
  tasks:tasks,
  suppliedNote:'⚠️ Daily limit 7h 30m রেখে Oct 17–25 এ মোট জায়গা হয় প্রায় 59h, কিন্তু task মোট প্রায় 73h। তাই 15h এর task বাকি থাকছে:',
  flags:[
    'Oct 16 is a rest day (Rest 😴). It has no tasks and no duration.',
    'Only day totals were supplied. Individual tasks on dated days have no duration, so none was invented. Each day\'s total is stored as that day\'s planned time.',
    'Oct 22 "L37–38", "L43" and Oct 24 "L39–43 rev" follow a "Bangla 2nd" entry in a comma list. They are stored word for word and tagged Bangla 2nd. Please confirm.',
    'Oct 25 "8–9" is stored as written and tagged Eng 1st. The undated "Eng 1st Pattern Practice (1h)" may or may not be the same as the Oct 25 "practice". Both are kept.',
    '"C4, C5, C7, C8, C9, C12 (6h 30m)" has one total for six chapters, so it is one undated task. Split it with Duplicate and Edit if you want separate tasks.',
    '"G+C6" and "G+C11" are kept exactly and tagged Eng 2nd only. Their exact meaning was not given.',
    'Your note says about 59h of room and about 73h of tasks. The supplied numbers add up to 58h 15m of room (Oct 17–25) and 14h 30m of undated tasks. The routine uses the supplied numbers, not the rounded ones.',
    'Nothing was supplied for Oct 26 to Nov 11. The earlier exam-preparation plan was not loaded. You can add it from Settings, Routine tools.',
    'The earlier Oct 25 exception of 7h 45m no longer applies. Oct 25 is now 6h 45m, and no day exceeds 7h 30m.',
    'The year is assumed to be 2026.'
  ]
};
/* Optional: the earlier Oct 26 to Nov 11 plan. Added only if you choose it in More. */
days=[];tasks=[];
function E(mmdd,items,note){D(mmdd,null,note||'',items.map(function(t){return[t[0],t[1]]}),'e')}
E('10/26',[['Finish English 1st Paper preparation.',[E1]],['Then English 2nd Paper only.',[E2]]]);
E('10/27',[['ICT only.',[I]]]);
E('10/28',[['Islam only.',[IS]]]);
E('10/29',[['Finish Islam preparation.',[IS]],['Then Bangla 1st Paper + C13 (1h).',[B1,C]]]);
E('10/30',[['Weak Chapters Only (1h 30m) + Bangla 1st Paper.',[B1]]]);
E('10/31',[['Bangla 1st Paper only.',[B1]]]);
E('11/01',[['Finish Bangla 1st Paper preparation.',[B1]],['Then Bangla 2nd Paper only.',[B2]]]);
E('11/02',[['BGS only.',[B]]]);
E('11/03',[['Finish BGS preparation.',[B]],['Then Chemistry.',[C]]]);
E('11/04',[['Chemistry only.',[C]]]);
E('11/05',[['After Chemistry, focus on Physics.',['Physics']]],'Earlier plan: Nov 5–8');
E('11/06',[['After Chemistry, focus on Physics.',['Physics']]],'Earlier plan: Nov 5–8');
E('11/07',[['After Chemistry, focus on Physics.',['Physics']]],'Earlier plan: Nov 5–8');
E('11/08',[['After Chemistry, focus on Physics.',['Physics']],['Nov 8: Physics only.',['Physics']]],'Earlier plan: Nov 5–8');
E('11/09',[['Finish Physics preparation.',['Physics']],['Then Higher Mathematics (HM) only.',[H]]]);
E('11/10',[['Finish Higher Mathematics preparation.',[H]],['Then Biology only.',[BIO]]]);
E('11/11',[['Biology exam.',[BIO]]]);
window.EARLIER_EXAM_PREP={days:days,tasks:tasks};
})();
