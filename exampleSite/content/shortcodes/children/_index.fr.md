---
title : Children (Pages filles)
description : Liste les pages filles de la page
---

Utilisez le shortcode *children* pour lister les pages filles de la page et tous ses déscendants (pages filles de pages filles). Par défaut, le shortcode affiche des liens vers les pages filles.

## Utilisation

| Paramètre | Défaut | Description |
|:--|:--|:--|
| style | "li" | Choisi le style à utiliser pour afficher les descendants. Cela peut être n'importe quel balise HTML |
| showhidden | "false" | Quand *true*, pages filles cachées dans le menu seront affichées quand même |
| description  | "false" | Permet d'inclure le texte de la description de la page sous chaque entré de la liste. Quand aucune description existe pour la page, le shortcode prend les 70 premiers mots du contenu. [Plus d'infos sur gohugo.io](https://gohugo.io/content/summaries/) |
| depth | 1 | Nombre de descendants à afficher. Par exemple, si la valeur est 2, le shortcode va afficher 2 niveaux de pages filels. **Astuce:** Utilisez 999 pour avoir tous les descendants |
| sort | "Weight" | Tri les pages filles par **Weight** (poids -- l'ordre du menu), **Title** (titre de la page alphabétiquement), **PublishDate** (date de publication dans le *front matter*), **Date** (date dans le *front matter*) ou **Length** (longueur du contenu de la page) |

## Démo

	{{%/* children  */%}}

{{% children %}}

	{{%/* children description="true"   */%}}

{{%children description="true"   %}}

	{{%/* children depth="3" showhidden="true" */%}}

{{% children depth="3" showhidden="true" %}}

	{{%/* children style="h2" depth="3" description="true" */%}}

{{% children style="h2" depth="3" description="true" %}}

	{{%/* children style="div" depth="999" sort="Title" */%}}

{{% children style="div" depth="999" sort="Title" %}}
