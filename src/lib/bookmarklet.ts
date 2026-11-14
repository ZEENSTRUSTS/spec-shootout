/**
 * "Grab photos" bookmarklet. Runs on a product page the user has open, collects that product's
 * photo set (front first, then every gallery angle) and copies it to the clipboard as JSON
 * that the Spec Shootout photo manager understands. No comments inside: it becomes one line.
 */
const code = `(function(){
var H=location.hostname,h=document.documentElement.innerHTML,seen={},files=[],src='';
function add(s){if(s&&/^https:\\/\\/[^\\/]+\\/./.test(s)&&!seen[s]){seen[s]=1;files.push(s);}}
if(/bhphotovideo/.test(H)){
  src='B&H Photo Video';
  var m=h.match(/images\\/images1000x1000\\/(\\d+_\\d+)\\.jpg/);
  if(m)add('https://static.bhphoto.com/images/images750x750/'+m[1]+'.jpg');
  var re=/multiple_images\\/images1000x1000\\/(\\d+_IMG_\\d+)\\.jpg/g,x;
  while((x=re.exec(h)))add('https://static.bhphoto.com/images/multiple_images/images750x750/'+x[1]+'.jpg');
}else if(/dji\\.com|djiits/.test(H)){
  src='DJI';
  var r2=/(https:\\/\\/se-cdn\\.djiits\\.com\\/tpc\\/uploads\\/carousel\\/image\\/[a-f0-9]{32})@/g,y;
  while((y=r2.exec(h)))add(y[1]+'@large.jpg');
}
if(files.length<2){
  if(!src)src=H.replace(/^www\\./,'');
  var og=document.querySelector('meta[property="og:image"]');if(og)add(og.content);
  Array.prototype.slice.call(document.images).filter(function(i){var w=i.naturalWidth,ht=i.naturalHeight;return w>=400&&ht>=250&&w/ht>0.6&&w/ht<2.2&&!/logo|icon|sprite|banner|_bg|bg_|background|avatar/i.test(i.src);})
    .sort(function(a,b){return b.naturalWidth*b.naturalHeight-a.naturalWidth*a.naturalHeight;})
    .slice(0,8).forEach(function(i){add(i.currentSrc||i.src);});
}
files=files.slice(0,8);
var t=(document.querySelector('h1')||{}).innerText||document.title;
var data=JSON.stringify({specShootout:1,title:t.trim(),page:location.href.split('?')[0].split('#')[0],source:src,files:files});
var box=document.createElement('div');
box.style.cssText='position:fixed;z-index:2147483647;right:16px;bottom:16px;width:360px;background:#16191f;color:#eceef2;font:14px/1.4 system-ui,sans-serif;border:1px solid #ffb547;border-radius:14px;padding:14px;box-shadow:0 20px 50px rgba(0,0,0,.5)';
var thumbs=files.slice(0,6).map(function(f){return '<img src="'+f+'" style="width:52px;height:52px;object-fit:contain;background:#fff;border-radius:6px;margin:2px">';}).join('');
function show(msg,manual){box.innerHTML='<b style="color:#ffb547">Spec Shootout</b><div style="margin:6px 0">'+msg+'</div><div>'+thumbs+'</div>'+(manual?'<textarea style="width:100%;height:70px;margin-top:6px">'+data.replace(/</g,'&lt;')+'</textarea>':'')+'<div style="margin-top:6px;color:#8d94a0;font-size:12px">Click to close</div>';box.onclick=function(e){if(e.target.tagName!=='TEXTAREA')box.remove();};document.body.appendChild(box);if(manual){var ta=box.querySelector('textarea');ta.focus();ta.select();}}
if(!files.length){show('No product photos found on this page.',false);return;}
var label=files.length+' photo'+(files.length>1?'s':'')+' of <b>'+t.trim().slice(0,70)+'</b> copied. Now click <b>Paste</b> in Spec Shootout.';
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(data).then(function(){show(label,false);},function(){show('Press Ctrl+C to copy, then Paste in Spec Shootout:',true);});}
else show('Press Ctrl+C to copy, then Paste in Spec Shootout:',true);
})();`;

export const BOOKMARKLET = 'javascript:' + encodeURIComponent(code.replace(/\n\s*/g, ''));
