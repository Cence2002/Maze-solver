!function(i,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(i=i||self).Delaunator=t()}(this,function(){"use strict";var i=Math.pow(2,-52),t=new Uint32Array(512),r=function(i){var t=i.length>>1;if(t>0&&"number"!=typeof i[0])throw new Error("Expected coords to contain numbers.");this.coords=i;var r=Math.max(2*t-5,0);this._triangles=new Uint32Array(3*r),this._halfedges=new Int32Array(3*r),this._hashSize=Math.ceil(Math.sqrt(t)),this._hullPrev=new Uint32Array(t),this._hullNext=new Uint32Array(t),this._hullTri=new Uint32Array(t),this._hullHash=new Int32Array(this._hashSize).fill(-1),this._ids=new Uint32Array(t),this._dists=new Float64Array(t),this.update()};function s(i,t,r,s){var h=i-r,a=t-s;return h*h+a*a}function h(i,t,r,s,h,a){return(s-t)*(h-r)-(r-i)*(a-s)<0}function a(i,t,r,s,h,a){var e=r-i,n=s-t,l=h-i,o=a-t,_=e*e+n*n,f=l*l+o*o,d=.5/(e*o-n*l),v=(o*_-n*f)*d,u=(e*f-l*_)*d;return v*v+u*u}function e(i,t,r,s){if(s-r<=20)for(var h=r+1;h<=s;h++){for(var a=i[h],l=t[a],o=h-1;o>=r&&t[i[o]]>l;)i[o+1]=i[o--];i[o+1]=a}else{var _=r+1,f=s;n(i,r+s>>1,_),t[i[r]]>t[i[s]]&&n(i,r,s),t[i[_]]>t[i[s]]&&n(i,_,s),t[i[r]]>t[i[_]]&&n(i,r,_);for(var d=i[_],v=t[d];;){do{_++}while(t[i[_]]<v);do{f--}while(t[i[f]]>v);if(f<_)break;n(i,_,f)}i[r+1]=i[f],i[f]=d,s-_+1>=f-r?(e(i,t,_,s),e(i,t,r,f-1)):(e(i,t,r,f-1),e(i,t,_,s))}}function n(i,t,r){var s=i[t];i[t]=i[r],i[r]=s}function l(i){return i[0]}function o(i){return i[1]}return r.from=function(i,t,s){void 0===t&&(t=l),void 0===s&&(s=o);for(var h=i.length,a=new Float64Array(2*h),e=0;e<h;e++){var n=i[e];a[2*e]=t(n),a[2*e+1]=s(n)}return new r(a)},r.prototype.update=function(){for(var t=this.coords,r=this._hullPrev,n=this._hullNext,l=this._hullTri,o=this._hullHash,_=t.length>>1,f=1/0,d=1/0,v=-1/0,u=-1/0,y=0;y<_;y++){var g=t[2*y],c=t[2*y+1];g<f&&(f=g),c<d&&(d=c),g>v&&(v=g),c>u&&(u=c),this._ids[y]=y}for(var w,p,b,A=(f+v)/2,k=(d+u)/2,x=1/0,S=0;S<_;S++){var z=s(A,k,t[2*S],t[2*S+1]);z<x&&(w=S,x=z)}var U=t[2*w],M=t[2*w+1];x=1/0;for(var T=0;T<_;T++)if(T!==w){var m=s(U,M,t[2*T],t[2*T+1]);m<x&&m>0&&(p=T,x=m)}for(var K=t[2*p],L=t[2*p+1],P=1/0,E=0;E<_;E++)if(E!==w&&E!==p){var F=a(U,M,K,L,t[2*E],t[2*E+1]);F<P&&(b=E,P=F)}var H=t[2*b],I=t[2*b+1];if(P===1/0){for(var N=0;N<_;N++)this._dists[N]=t[2*N]-t[0]||t[2*N+1]-t[1];e(this._ids,this._dists,0,_-1);for(var j=new Uint32Array(_),q=0,D=0,B=-1/0;D<_;D++){var C=this._ids[D];this._dists[C]>B&&(j[q++]=C,B=this._dists[C])}return this.hull=j.subarray(0,q),this.triangles=new Uint32Array(0),void(this.halfedges=new Uint32Array(0))}if(h(U,M,K,L,H,I)){var G=p,J=K,O=L;p=b,K=H,L=I,b=G,H=J,I=O}var Q=function(i,t,r,s,h,a){var e=r-i,n=s-t,l=h-i,o=a-t,_=e*e+n*n,f=l*l+o*o,d=.5/(e*o-n*l);return{x:i+(o*_-n*f)*d,y:t+(e*f-l*_)*d}}(U,M,K,L,H,I);this._cx=Q.x,this._cy=Q.y;for(var R=0;R<_;R++)this._dists[R]=s(t[2*R],t[2*R+1],Q.x,Q.y);e(this._ids,this._dists,0,_-1),this._hullStart=w;var V=3;n[w]=r[b]=p,n[p]=r[w]=b,n[b]=r[p]=w,l[w]=0,l[p]=1,l[b]=2,o.fill(-1),o[this._hashKey(U,M)]=w,o[this._hashKey(K,L)]=p,o[this._hashKey(H,I)]=b,this.trianglesLen=0,this._addTriangle(w,p,b,-1,-1,-1);for(var W=0,X=void 0,Y=void 0;W<this._ids.length;W++){var Z=this._ids[W],$=t[2*Z],ii=t[2*Z+1];if(!(W>0&&Math.abs($-X)<=i&&Math.abs(ii-Y)<=i)&&(X=$,Y=ii,Z!==w&&Z!==p&&Z!==b)){for(var ti=0,ri=0,si=this._hashKey($,ii);ri<this._hashSize&&(-1===(ti=o[(si+ri)%this._hashSize])||ti===n[ti]);ri++);for(var hi=ti=r[ti],ai=void 0;ai=n[hi],!h($,ii,t[2*hi],t[2*hi+1],t[2*ai],t[2*ai+1]);)if((hi=ai)===ti){hi=-1;break}if(-1!==hi){var ei=this._addTriangle(hi,Z,n[hi],-1,-1,l[hi]);l[Z]=this._legalize(ei+2),l[hi]=ei,V++;for(var ni=n[hi];ai=n[ni],h($,ii,t[2*ni],t[2*ni+1],t[2*ai],t[2*ai+1]);)ei=this._addTriangle(ni,Z,ai,l[Z],-1,l[ni]),l[Z]=this._legalize(ei+2),n[ni]=ni,V--,ni=ai;if(hi===ti)for(;h($,ii,t[2*(ai=r[hi])],t[2*ai+1],t[2*hi],t[2*hi+1]);)ei=this._addTriangle(ai,Z,hi,-1,l[hi],l[ai]),this._legalize(ei+2),l[ai]=ei,n[hi]=hi,V--,hi=ai;this._hullStart=r[Z]=hi,n[hi]=r[ni]=Z,n[Z]=ni,o[this._hashKey($,ii)]=Z,o[this._hashKey(t[2*hi],t[2*hi+1])]=hi}}}this.hull=new Uint32Array(V);for(var li=0,oi=this._hullStart;li<V;li++)this.hull[li]=oi,oi=n[oi];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)},r.prototype._hashKey=function(i,t){return Math.floor((r=i-this._cx,s=t-this._cy,h=r/(Math.abs(r)+Math.abs(s)),(s>0?3-h:1+h)/4*this._hashSize))%this._hashSize;var r,s,h},r.prototype._legalize=function(i){for(var r,s,h,a,e,n,l,o,_,f,d,v,u,y,g,c,w=this._triangles,p=this._halfedges,b=this.coords,A=0,k=0;;){var x=p[i],S=i-i%3;if(k=S+(i+2)%3,-1!==x){var z=x-x%3,U=S+(i+1)%3,M=z+(x+2)%3,T=w[k],m=w[i],K=w[U],L=w[M];if(r=b[2*T],s=b[2*T+1],h=b[2*m],a=b[2*m+1],e=b[2*K],n=b[2*K+1],l=b[2*L],o=b[2*L+1],_=void 0,f=void 0,d=void 0,v=void 0,u=void 0,y=void 0,void 0,g=void 0,c=void 0,(_=r-l)*((v=a-o)*(c=(u=e-l)*u+(y=n-o)*y)-(g=(d=h-l)*d+v*v)*y)-(f=s-o)*(d*c-g*u)+(_*_+f*f)*(d*y-v*u)<0){w[i]=L,w[x]=T;var P=p[M];if(-1===P){var E=this._hullStart;do{if(this._hullTri[E]===M){this._hullTri[E]=i;break}E=this._hullPrev[E]}while(E!==this._hullStart)}this._link(i,P),this._link(x,p[k]),this._link(k,M);var F=z+(x+1)%3;A<t.length&&(t[A++]=F)}else{if(0===A)break;i=t[--A]}}else{if(0===A)break;i=t[--A]}}return k},r.prototype._link=function(i,t){this._halfedges[i]=t,-1!==t&&(this._halfedges[t]=i)},r.prototype._addTriangle=function(i,t,r,s,h,a){var e=this.trianglesLen;return this._triangles[e]=i,this._triangles[e+1]=t,this._triangles[e+2]=r,this._link(e,s),this._link(e+1,h),this._link(e+2,a),this.trianglesLen+=3,e},r});