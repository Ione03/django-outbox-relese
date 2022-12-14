_g='latest_news'
_f='latest_announcement'
_e='detail model = '
_d='random_paint'
_c='latest_kind'
_b='categories_list'
_a="Menu Group '%s' belum terdaftar, silahkan daftar di halaman <a href='%s'>admin</a>"
_Z='banner'
_Y='document'
_X='/dashboard'
_W='kind'
_V='pages'
_U='Halaman tidak ditemukan!'
_T='slug'
_S='article'
_R='videogallery'
_Q='events'
_P='base_url'
_O='socialmedia'
_N='relatedlink'
_M='menugroup'
_L='/admin'
_K="service untuk '%s' belum terdaftar, silahkan daftar di halaman <a href='%s'>admin</a>"
_J='education'
_I=True
_H='slideshow'
_G='logo'
_F='greeting'
_E='news'
_D='photogallery'
_C='announcement'
_B='-updated_at'
_A=None
import calendar,datetime,random
from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.contrib.sites.models import Site
from django.core.cache import cache
from django.core.paginator import Paginator
from django.db.models import Count,OuterRef,Subquery
from django.http import Http404
from django.views.generic import TemplateView
from hitcount.models import Hit,HitCount
from hitcount.views import HitCountMixin
from menu.models import MenuGroup
from parler.utils import get_active_language_choices
from core.common import get_agency_info
from django_outbox.common import get_site_id,get_template,get_week_date
from django_outbox.views import service_exists
from .models import *
def get_menu_group(site_id):
	menugroup=MenuGroup.objects.filter(site_id=site_id,kind=1)
	if menugroup:return menugroup[0].id
	else:raise Http404("Menu Group belum terdaftar, silahkan daftar di halaman <a href='%s'>admin</a>"%_X)
def get_photo(model_name):return Subquery(Photo.objects.filter(object_id=OuterRef('id'),content_type__model=model_name).values('file_path')[:1])
def get_logo(site_id):
	subquery_foto=get_photo(_G);logo=Logo.objects.filter(site_id=site_id).values('name').annotate(file_path=subquery_foto)[:1]
	if logo:return logo
def get_base_url(request):
	A='/';my_path=request.path.split(A)
	if my_path:
		if len(my_path)>2:return my_path[0]+A+my_path[1]+A+my_path[2]
def add_months(sourcedate,months):month=sourcedate.month-1+months;year=sourcedate.year+month//12;month=month%12+1;day=min(sourcedate.day,calendar.monthrange(year,month)[1]);return datetime.date(year,month,day)
def get_statistic(site_id,is_cache=False):
	C='user_agent';B=')';A='load from DB (';context={};tgl=datetime.datetime.now();content_type_id=ContentType.objects.get(app_label='sites',model='site');content_type_id=content_type_id.id if content_type_id else _A;hitcount_id=HitCount.objects.filter(content_type_id=content_type_id,object_pk=site_id).first();hitcount_id=hitcount_id.id if hitcount_id else _A;tgl00=tgl+datetime.timedelta(days=1);jam00=datetime.datetime(tgl00.year,tgl00.month,tgl00.day,0,1,0);timeout=(jam00-tgl00).seconds;selisih=0;tmp='hit_today';tmp_cache=cache.get(tmp,version=site_id)
	if not(is_cache and tmp_cache is not _A):print(A+tmp+B);hit_today=Hit.objects.filter(hitcount_id=hitcount_id,created__year=tgl.year,created__month=tgl.month,created__day=tgl.day);tmp_cache=hit_today.count()if hit_today else 1;cache.set(tmp,tmp_cache,timeout,version=site_id);context[tmp]=tmp_cache
	else:hit_today=Hit.objects.filter(hitcount_id=hitcount_id,created__year=tgl.year,created__month=tgl.month,created__day=tgl.day);context[tmp]=hit_today.count()if hit_today else 1;selisih=context[tmp]-tmp_cache;print('selisih = ',selisih)
	tmp='hit_yesterday';tmp_cache=cache.get(tmp,version=site_id)
	if not(is_cache and tmp_cache is not _A):print(A+tmp+B);start_date=tgl+datetime.timedelta(days=-1);tmp_cache=Hit.objects.filter(hitcount_id=hitcount_id,created__year=start_date.year,created__month=start_date.month,created__day=start_date.day).count();cache.set(tmp,tmp_cache,timeout,version=site_id)
	context[tmp]=tmp_cache;tmp='hit_this_week';tmp_cache=cache.get(tmp,version=site_id)
	if not(is_cache and tmp_cache is not _A):print(A+tmp+B);start_date,end_date=get_week_date(tgl.year,tgl.month,tgl.day);tmp_cache=Hit.objects.filter(hitcount_id=hitcount_id,created__range=(start_date,end_date)).count();cache.set(tmp,tmp_cache,timeout,version=site_id)
	tmp_cache+=selisih;context[tmp]=tmp_cache;tmp='hit_last_week';tmp_cache=cache.get(tmp,version=site_id)
	if not(is_cache and tmp_cache is not _A):print(A+tmp+B);start_date,end_date=get_week_date(tgl.year,tgl.month,tgl.day);start_date=start_date+datetime.timedelta(days=-7);end_date=end_date+datetime.timedelta(days=-7);tmp_cache=Hit.objects.filter(hitcount_id=hitcount_id,created__range=(start_date,end_date)).count();cache.set(tmp,tmp_cache,timeout,version=site_id)
	context[tmp]=tmp_cache;tmp='hit_this_month';tmp_cache=cache.get(tmp,version=site_id)
	if not(is_cache and tmp_cache is not _A):print(A+tmp+B);tmp_cache=Hit.objects.filter(hitcount_id=hitcount_id,created__year=tgl.year,created__month=tgl.month).count();cache.set(tmp,tmp_cache,timeout,version=site_id)
	tmp_cache+=selisih;context[tmp]=tmp_cache;tmp='hit_last_month';tmp_cache=cache.get(tmp,version=site_id)
	if not(is_cache and tmp_cache is not _A):print(A+tmp+B);start_date=add_months(tgl,-1);tmp_cache=Hit.objects.filter(hitcount_id=hitcount_id,created__year=start_date.year,created__month=start_date.month).count();cache.set(tmp,tmp_cache,timeout,version=site_id)
	context[tmp]=tmp_cache;start_date=tgl+datetime.timedelta(hours=-5);start_date=datetime.datetime(start_date.year,start_date.month,start_date.day,start_date.hour,0,0);end_date=datetime.datetime(tgl.year,tgl.month,tgl.day,tgl.hour,59,59);hit_online=Hit.objects.filter(hitcount_id=hitcount_id,created__range=(start_date,end_date)).values(C).order_by(C).distinct();context['hit_online']=hit_online.count()if hit_online else 1;tmp='hit_all';tmp_cache=cache.get(tmp,version=site_id)
	if not(is_cache and tmp_cache is not _A):print(A+tmp+B);hit_count=HitCount.objects.filter(object_pk=site_id,content_type_id=content_type_id);tmp_cache=hit_count[0].hits if hit_count else 1;cache.set(tmp,tmp_cache,timeout,version=site_id)
	tmp_cache+=selisih;context[tmp]=tmp_cache;return context
def get_banner(site_id):subquery_foto=get_photo(_Z);return Banner.objects.filter(site_id=site_id).annotate(file_path=subquery_foto)[:5]
def get_announcement(site_id,lang,max_data):subquery_foto=get_photo(_C);return Announcement.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by('priority',_B)[:max_data]
def get_slideshow(site_id,lang):subquery_foto=get_photo(_H);obj=SlideShow.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by(_B)[:10];obj=list(obj);random.shuffle(obj);return obj
def get_dailyalert(site_id,lang):return DailyAlert.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).order_by(_B)[:10]
def get_greeting(site_id,lang):subquery_foto=get_photo(_F);return Greeting.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by(_B)[:1]
def get_events(site_id,lang):subquery_foto=get_photo(_Q);return Events.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by(_B)[:7]
def get_photogallery(site_id,lang):subquery_foto=get_photo(_D);return PhotoGallery.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by(_B)[:10]
def get_videogallery(site_id,lang):subquery_foto=get_photo(_R);return VideoGallery.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by(_B)[:6]
def get_relatedlink(site_id,lang):return RelatedLink.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).order_by(_B)[:10]
def get_news(site_id,lang):subquery_foto=get_photo(_E);return News.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by(_B)[:7]
def get_article(site_id,lang):subquery_foto=get_photo(_S);return Article.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).annotate(file_path=subquery_foto).order_by(_B)[:6]
def get_document(site_id,lang):return Document.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).order_by(_B)[:7]
def get_socialmedia(site_id):return SocialMedia.objects.filter(site_id=site_id,status=OptStatusPublish.PUBLISHED).order_by(_B)[:6]
def get_categories_list(site_id,lang,max_data,model):
	B='count';A='categories_id';subquery=Subquery(Categories.objects.translated(lang).filter(id=OuterRef(A)).values('translations__name')[:1]);subquery_slug=Subquery(Categories.objects.translated(lang).filter(id=OuterRef(A)).values(_T)[:1]);categories_list=[];obj=model.objects.filter(site_id=site_id).values(A).annotate(count=Count(A)).annotate(name=subquery).annotate(slug=subquery_slug).order_by(A)[:max_data]
	if obj:
		all=0
		for i in obj:all+=i[B]
		categories_list.append(obj[0]);categories_all={A:0,B:all,'name':'All',_T:'all'};categories_list.insert(0,categories_all);return categories_list
def get_latest_model(site_id,lang,max_data,model,kind,slug=_A):
	subquery_foto=get_photo(kind)
	if slug:return model.objects.translated(lang).filter(site_id=site_id).annotate(file_path=subquery_foto).exclude(slug=slug).order_by(_B)[:max_data]
	else:return model.objects.translated(lang).filter(site_id=site_id).annotate(file_path=subquery_foto).order_by(_B)[:max_data]
def get_random_items(qs,max_data):possible_ids=list(qs.values_list('id',flat=_I));req_no_of_random_items=len(possible_ids)+1 if len(possible_ids)+1<max_data else max_data;possible_ids=random.choices(possible_ids,k=req_no_of_random_items);return qs.filter(pk__in=possible_ids)
def get_related_model(site_id,lang,max_data,model,kind,slug):
	subquery_foto=get_photo(kind);qs=model.objects.translated(lang).filter(site_id=site_id).exclude(slug=slug)
	if qs:random_paint=get_random_items(qs,max_data);random_paint=random_paint.annotate(file_path=subquery_foto);return random_paint
def get_content_detail(site_id,lang,model,kind,slug):
	print(site_id,lang,model,kind,slug);subquery_foto=get_photo(kind);obj=model.objects.translated(lang).filter(site_id=site_id,slug=slug).annotate(file_path=subquery_foto)
	if obj:return obj.get()
	else:raise Http404(_U)
def get_content_list(site_id,lang,model,kind,slug):
	A='-created_at'
	if not slug:raise Http404(_U)
	subquery_foto=get_photo(kind)
	if slug=='all':return model.objects.translated(lang).filter(site_id=site_id).annotate(file_path=subquery_foto).order_by(A)
	else:
		categories=Categories.objects.filter(slug=slug);categories=categories.get()if categories else _A
		if categories:return model.objects.translated(lang).filter(site_id=site_id,categories_id=categories.id).annotate(file_path=subquery_foto).order_by(A)
		else:raise Http404('Categories '+slug+' tidak ditemukan!')
def get_location(site_id,lang):return Location.objects.language(lang).filter(site_id=site_id,status=OptStatusPublish.PUBLISHED)[:1]
class IndexView(TemplateView):
	site_id=_A
	def get(self,request,*args,**kwargs):
		self.site_id=get_site_id(request);service=service_exists(request)
		if not service:raise Http404(_K%(request.get_host(),_L))
		if request.session.session_key:obj=Site.objects.get(id=self.site_id);hit_count=HitCount.objects.get_for_object(request,obj);hit_count_response=HitCountMixin.hit_count(request,hit_count)
		template=get_template(self.site_id);self.template_name=template+'index.html';return super(IndexView,self).get(request,*(args),**kwargs)
	def get_context_data(self,*args,**kwargs):context=super(IndexView,self).get_context_data(*(args),**kwargs);context[_M]=get_menu_group(self.site_id);agency=get_agency_info(self.site_id);context.update(agency);statistic=get_statistic(self.site_id,_I);context.update(statistic);context[_G]=get_logo(self.site_id);lang=get_active_language_choices()[0];context[_Z]=get_banner(self.site_id);context[_C]=get_announcement(self.site_id,lang,4);context[_H]=get_slideshow(self.site_id,lang);context['dailyalert']=get_dailyalert(self.site_id,lang);context[_F]=get_greeting(self.site_id,lang);context[_Q]=get_events(self.site_id,lang);context[_D]=get_photogallery(self.site_id,lang);context[_R]=get_videogallery(self.site_id,lang);context[_N]=get_relatedlink(self.site_id,lang);context[_E]=get_news(self.site_id,lang);context[_S]=get_article(self.site_id,lang);context[_Y]=get_document(self.site_id,lang);context[_O]=get_socialmedia(self.site_id);context['location']=get_location(self.site_id,lang);context[_P]=get_base_url(self.request);return context
class DetailView(TemplateView):
	site_id=_A
	def get(self,request,*args,**kwargs):
		self.site_id=get_site_id(request);service=service_exists(request)
		if not service:raise Http404(_K%(request.get_host(),_L))
		template=get_template(self.site_id);self.template_name=template+'detail.html';return super(DetailView,self).get(request,*(args),**kwargs)
	def get_context_data(self,*args,**kwargs):
		context=super(DetailView,self).get_context_data(*(args),**kwargs);context[_M]=get_menu_group(self.site_id);slug=self.kwargs[_T]
		if not slug:raise Http404(_a%(self.request.get_host(),_X))
		agency=get_agency_info(self.site_id);context.update(agency);statistic=get_statistic(self.site_id,_I);context.update(statistic);context[_G]=get_logo(self.site_id);lang=get_active_language_choices()[0];kinds=[_C,_E,_S,_Q,_Y,_F,_V,_H];kind=self.kwargs[_W]
		if kind in kinds:context[_W]=kind
		else:raise Http404(_U)
		context[_C]=get_announcement(self.site_id,lang,6);model=apps.get_model(_J,kind)
		if kind not in[_V,_F,_H]:context[_b]=get_categories_list(self.site_id,lang,10,model);context[_c]=get_latest_model(self.site_id,lang,3,model,kind,slug);context[_d]=get_related_model(self.site_id,lang,5,model,kind,slug)
		print(_e,model,kind);content_detail=get_content_detail(self.site_id,lang,model,kind,slug);context['content_detail']=content_detail;hit_count=HitCount.objects.get_for_object(self.request,content_detail);hit_count_response=HitCountMixin.hit_count(self.request,hit_count);context[_D]=get_photogallery(self.site_id,lang);context[_N]=get_relatedlink(self.site_id,lang);context[_O]=get_socialmedia(self.site_id);context[_P]=get_base_url(self.request);return context
class ListView(TemplateView):
	site_id=_A
	def get(self,request,*args,**kwargs):
		self.site_id=get_site_id(request);service=service_exists(request)
		if not service:raise Http404(_K%(request.get_host(),_L))
		template=get_template(self.site_id);self.template_name=template+'list.html';return super(ListView,self).get(request,*(args),**kwargs)
	def get_context_data(self,*args,**kwargs):
		context=super(ListView,self).get_context_data(*(args),**kwargs);context[_M]=get_menu_group(self.site_id);slug=self.kwargs[_T]
		if not slug:raise Http404(_a%(self.request.get_host(),_X))
		agency=get_agency_info(self.site_id);context.update(agency);statistic=get_statistic(self.site_id,_I);context.update(statistic);context[_G]=get_logo(self.site_id);lang=get_active_language_choices()[0];kinds=[_C,_E,_S,_Q,_Y,_F,_V,_H,_R,_D];kind=self.kwargs[_W]
		if kind in kinds:context[_W]=kind
		else:raise Http404(_U)
		print('Kind = ',kind);context[_C]=get_announcement(self.site_id,lang,6);model=apps.get_model(_J,kind)
		if kind not in[_V,_F,_H,_R,_D]:context[_b]=get_categories_list(self.site_id,lang,10,model);context[_c]=get_latest_model(self.site_id,lang,3,model,kind,slug);context[_d]=get_related_model(self.site_id,lang,5,model,kind,slug)
		print(_e,model,kind);content_list=get_content_list(self.site_id,lang,model,kind,slug)
		if content_list:kind_data_per_page=8;paginator=Paginator(content_list,kind_data_per_page);page_number=self.request.GET.get('page',1);context['page_list']=paginator.get_page(page_number)
		context[_D]=get_photogallery(self.site_id,lang);context[_N]=get_relatedlink(self.site_id,lang);context[_O]=get_socialmedia(self.site_id);context[_P]=get_base_url(self.request);return context
class DescriptionView(TemplateView):
	site_id=_A
	def get(self,request,*args,**kwargs):
		self.site_id=get_site_id(request);service=service_exists(request)
		if not service:raise Http404(_K%(request.get_host(),_L))
		template=get_template(self.site_id);self.template_name=template+'description.html';return super(DescriptionView,self).get(request,*(args),**kwargs)
	def get_context_data(self,*args,**kwargs):context=super(DescriptionView,self).get_context_data(*(args),**kwargs);context[_M]=get_menu_group(self.site_id);agency=get_agency_info(self.site_id);context.update(agency);statistic=get_statistic(self.site_id,_I);context.update(statistic);context[_G]=get_logo(self.site_id);lang=get_active_language_choices()[0];context[_C]=get_announcement(self.site_id,lang,6);model=apps.get_model(_J,_C);context[_f]=get_latest_model(self.site_id,lang,3,model,_C);model=apps.get_model(_J,_E);context[_g]=get_latest_model(self.site_id,lang,3,model,_E);context[_D]=get_photogallery(self.site_id,lang);context[_N]=get_relatedlink(self.site_id,lang);context[_O]=get_socialmedia(self.site_id);context[_P]=get_base_url(self.request);return context
class GreetingView(TemplateView):
	site_id=_A
	def get(self,request,*args,**kwargs):
		self.site_id=get_site_id(request);service=service_exists(request)
		if not service:raise Http404(_K%(request.get_host(),_L))
		template=get_template(self.site_id);self.template_name=template+'greeting.html';return super(GreetingView,self).get(request,*(args),**kwargs)
	def get_context_data(self,*args,**kwargs):context=super(GreetingView,self).get_context_data(*(args),**kwargs);context[_M]=get_menu_group(self.site_id);agency=get_agency_info(self.site_id);context.update(agency);statistic=get_statistic(self.site_id,_I);context.update(statistic);context[_G]=get_logo(self.site_id);lang=get_active_language_choices()[0];context[_C]=get_announcement(self.site_id,lang,6);context[_F]=get_greeting(self.site_id,lang);model=apps.get_model(_J,_C);context[_f]=get_latest_model(self.site_id,lang,3,model,_C);model=apps.get_model(_J,_E);context[_g]=get_latest_model(self.site_id,lang,3,model,_E);context[_D]=get_photogallery(self.site_id,lang);context[_N]=get_relatedlink(self.site_id,lang);context[_O]=get_socialmedia(self.site_id);context[_P]=get_base_url(self.request);return context