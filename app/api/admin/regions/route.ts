
import { NextResponse } from 'next/server';
import { authorized } from '../../../../lib/auth';
import { db, regions } from '../../../../lib/data';

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  }

  return NextResponse.json(await regions(true));
}

export async function POST(req: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  }

  const c = db();

  if (!c) {
    return NextResponse.json({ error: 'Supabase 연결 필요' }, { status: 503 });
  }

  const d = await req.json();
  const allowed = ['seoul', 'gyeonggi', 'incheon'];

  if (
    !allowed.includes(d.province_slug) ||
    !/^[a-z0-9-]{2,60}$/.test(d.slug || '') ||
    !String(d.district || '').trim()
  ) {
    return NextResponse.json(
      { error: '지역 및 영문 주소를 확인하세요.' },
      { status: 400 }
    );
  }

  const names: Record<string, string> = {
    seoul: '서울특별시',
    gyeonggi: '경기도',
    incheon: '인천광역시',
  };

  const payload = {
    province: names[d.province_slug],
    province_slug: d.province_slug,
    district: String(d.district).slice(0, 60),
    slug: d.slug,
    neighborhoods: String(d.neighborhoods || '').slice(0, 2000),
    description: String(d.description || '').slice(0, 1000),
    published: !!d.published,
  };

  const upsertPayload = d.id
    ? { ...payload, id: Number(d.id) }
    : payload;

  const { error } = await c.from('regions').upsert(
    upsertPayload as never,
    { onConflict: d.id ? 'id' : 'province_slug,slug' }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
