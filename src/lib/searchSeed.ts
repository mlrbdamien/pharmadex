/**
 * Tampon de frappe partagé entre la coquille et la barre de recherche.
 *
 * Une douchette écrit comme un clavier très rapide, sans se soucier de
 * l'écran affiché. La coquille capte la frappe où qu'on soit, la pousse ici
 * et navigue vers la recherche ; la barre consomme le tampon en montant.
 * Sans tampon, les premiers caractères d'un scan seraient perdus pendant le
 * changement de route.
 */

type Subscriber = (char: string) => void;

let buffer = '';
const subscribers = new Set<Subscriber>();

export function pushSeed(char: string): void {
  if (subscribers.size > 0) {
    subscribers.forEach((notify) => notify(char));
  } else {
    buffer += char;
  }
}

export function consumeSeed(): string {
  const seed = buffer;
  buffer = '';
  return seed;
}

export function onSeed(subscriber: Subscriber): () => void {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
}
