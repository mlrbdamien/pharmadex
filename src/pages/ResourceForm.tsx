import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { TagInput } from '../components/TagInput';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import {
  createResource,
  deleteResource,
  fetchTitle,
  getResource,
  updateResource,
  uploadFile,
} from '../lib/resources';
import type { Resource, ResourceDraft } from '../lib/types';
import { formatSize, todayISO } from '../lib/format';

const FIELD =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:ring-0';
const LABEL = 'block text-sm font-medium text-slate-700';

export function ResourceForm() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { email } = useAuth();
  const { tags, refresh } = useStore();

  const editing = Boolean(id);
  const [current, setCurrent] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [kind, setKind] = useState<'lien' | 'fichier'>('lien');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(params.get('titre') ?? '');
  const [titleTouched, setTitleTouched] = useState(Boolean(params.get('titre')));
  const [description, setDescription] = useState('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [verifiedOn, setVerifiedOn] = useState(todayISO());
  const [owner, setOwner] = useState(email ?? '');
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const resource = await getResource(id);
        if (!resource) {
          setError('Ressource introuvable.');
          return;
        }
        setCurrent(resource);
        setKind(resource.file_path ? 'fichier' : 'lien');
        setUrl(resource.url ?? '');
        setTitle(resource.title);
        setTitleTouched(true);
        setDescription(resource.description ?? '');
        setTagList(resource.tags);
        setVerifiedOn(resource.verified_on ?? '');
        setOwner(resource.owner ?? '');
        setPinned(resource.pinned);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Coller une URL suffit : le titre de la page arrive tout seul. Le champ
  // reste éditable et l'échec n'est jamais bloquant — on saisit à la main.
  useEffect(() => {
    if (editing || titleTouched) return;
    const value = url.trim();
    if (!/^https?:\/\/\S+$/i.test(value)) return;

    const timer = setTimeout(async () => {
      setFetching(true);
      const found = await fetchTitle(value);
      setFetching(false);
      if (found) setTitle((currentTitle) => currentTitle || found);
    }, 300);
    return () => clearTimeout(timer);
  }, [url, editing, titleTouched]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) return setError('Le titre est obligatoire.');
    if (kind === 'lien' && !/^https?:\/\/\S+$/i.test(url.trim())) {
      return setError('Indiquez une URL commençant par http:// ou https://');
    }
    if (kind === 'fichier' && !file && !current?.file_path) {
      return setError('Choisissez un fichier à téléverser.');
    }

    setSaving(true);
    try {
      const uploaded = kind === 'fichier' && file ? await uploadFile(file) : null;

      const draft: ResourceDraft = {
        title: title.trim(),
        description: description.trim() || null,
        url: kind === 'lien' ? url.trim() : null,
        tags: tagList,
        pinned,
        verified_on: verifiedOn || null,
        owner: owner.trim() || null,
        ...(kind === 'fichier'
          ? (uploaded ?? {})
          : { file_path: null, file_name: null, file_size: null, mime_type: null }),
      };

      if (editing && id) await updateResource(id, draft);
      else await createResource(draft);

      await refresh();
      navigate('/');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Enregistrement impossible');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!current) return;
    if (!window.confirm(`Supprimer « ${current.title} » ?`)) return;
    setSaving(true);
    try {
      await deleteResource(current);
      await refresh();
      navigate('/');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Suppression impossible');
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="size-4" /> Retour
        </button>

        <h1 className="text-lg font-semibold text-slate-900">
          {editing ? 'Modifier la ressource' : 'Nouvelle ressource'}
        </h1>

        {loading ? (
          <p className="mt-8 flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" /> Chargement…
          </p>
        ) : (
          <form
            onSubmit={submit}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                void submit(event);
              }
            }}
            className="mt-4 space-y-4"
          >
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
              {(['lien', 'fichier'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setKind(option)}
                  className={`flex-1 rounded-md px-3 py-1.5 capitalize transition ${
                    kind === option ? 'bg-white font-medium text-teal-800 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {kind === 'lien' ? (
              <div>
                <label className={LABEL} htmlFor="url">
                  URL
                </label>
                <input
                  id="url"
                  type="url"
                  autoFocus={!editing}
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://…"
                  className={`mt-1 ${FIELD}`}
                />
              </div>
            ) : (
              <div>
                <label className={LABEL} htmlFor="file">
                  Fichier (PDF ou image, 20 Mo max.)
                </label>
                <input
                  id="file"
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const chosen = event.target.files?.[0] ?? null;
                    setFile(chosen);
                    if (chosen && !titleTouched && !title) setTitle(chosen.name.replace(/\.[^.]+$/, ''));
                  }}
                  className={`mt-1 ${FIELD} file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1`}
                />
                {!file && current?.file_name && (
                  <p className="mt-1 text-xs text-slate-400">
                    Actuel : {current.file_name} · {formatSize(current.file_size)}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className={LABEL} htmlFor="title">
                Titre {fetching && <span className="text-xs text-slate-400">— récupération…</span>}
              </label>
              <input
                id="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleTouched(true);
                }}
                className={`mt-1 ${FIELD}`}
              />
            </div>

            <div>
              <label className={LABEL} htmlFor="description">
                Description <span className="font-normal text-slate-400">(facultative)</span>
              </label>
              <textarea
                id="description"
                rows={2}
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="À quoi sert cette ressource, en une ligne."
                className={`mt-1 ${FIELD}`}
              />
            </div>

            <div>
              <span className={LABEL}>Tags</span>
              <div className="mt-1">
                <TagInput value={tagList} onChange={setTagList} suggestions={tags} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL} htmlFor="verified">
                  Vérifié le
                </label>
                <input
                  id="verified"
                  type="date"
                  value={verifiedOn}
                  onChange={(event) => setVerifiedOn(event.target.value)}
                  className={`mt-1 ${FIELD}`}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="owner">
                  Responsable
                </label>
                <input
                  id="owner"
                  value={owner}
                  onChange={(event) => setOwner(event.target.value)}
                  className={`mt-1 ${FIELD}`}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(event) => setPinned(event.target.checked)}
                className="size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              Épingler en haut de l'accueil
            </label>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm
                           font-medium text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                Enregistrer
              </button>
              <span className="text-xs text-slate-400">Ctrl + Entrée</span>
              <div className="flex-1" />
              {editing && (
                <button
                  type="button"
                  onClick={() => void remove()}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-600
                             hover:bg-red-50"
                >
                  <Trash2 className="size-4" /> Supprimer
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
