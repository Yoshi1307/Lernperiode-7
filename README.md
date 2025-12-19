Lern-Periode 7
24.10. bis 19.12.2025

Grob-Planung
Für welche API möchten Sie ein eigenes front end erstellen? Football API
Welche groben Funktionalitäten soll Ihr front end zur Verfügung stellen? Man kann die Tabellen von den verschiedenen Ligen anzeigen können
Was möchten Sie insbesondere dabei lernen oder üben? Ich möchte Lernen, wie man Seite Webseite mit einer API verbindet, und so auf externe Daten zugreifen kann.
24.10.
- [X] Arbeitspaket 1: Erstellen Sie mehrere Skizzen von Ihrem front end. Überlegen Sie sich auch, welche Elemente die Interaktion mit dem back end auslösen und wie sich die Oberfläche dadurch verändert. Bauen Sie auch Interaktionen ein, die keinen Aufruf der API benötigen, sondern sich im client bearbeiten lassen (sortieren, suchen etc.)
- [X] Arbeitspaket 2: Setzen Sie in HTML und CSS Ihren Entwurf auf rudimentäre Weise um.
- [ ] Arbeitspaket 3: Schreiben Sie ersten JS-Code als proof of concept (bspw. Meldung bei Klick auf Knopf-Element)

Heute habe als erstes meine Skizzen für die Seite gemacht, die SKizzen sind nicht sehr gut, und anderst als ich es jetzt umgesetz habe, da ich es so doch besser fand. Als nächstes habe ich probiert die Seite so zu desingen/generieren wie auf den Bildern. Da ich das nicht verstanden habe, habe ich das Desing halt gewchselt, so das ich es verstehe.


![WhatsApp Bild 2025-10-24 um 11 46 28_eb442cbe](https://github.com/user-attachments/assets/f1a07a42-b9a7-48be-b30b-6a50ed6b8ca1)


31.10.
- [ ] Die Tabelle für die Premier League einfügen (Mit Daten)
- [ ] Für die Anderen wichtigen Ligen auch die Tabellen machen
- [ ] Das Selbe für die Torschützenkönige zu machen. (Tabelle erstellen und Daten beziehen)

Heute habe ich zuerst damit begonnen, meine Webseite etwas zu verschönern. Es war nicht sehr viel, aber ein bisschen. Danach habe ich weiter versucht, die Tabelle der Premier League bei mir angezeigt zu bekommen. Ich habe sehr lange herumprobiert, bis ich gelesen habe, dass die API seit Sommer 2024 nicht mehr aktualisiert wird. Also habe ich begonnen, eine neue API zu suchen. Ich habe viel gefunden, aber keine von ihnen hat funktioniert oder war kostenlos. Heute konnte ich also fast nichts machen und habe keine funktionierende API mehr.

7.11.
- [X] Irgendeine funktionierende und Kostenlose API finden
- [ ] Die Tabelle der Premier League (oder irgendeiner Liga) einfügen
- [ ] Die anderen Tabellen einfügen

Heute habe ich wieder da weitergemacht, wo ich beim letzten Mal aufgehört habe, auf der Suche nach einer funktionierenden, kostenlosen Fussball-API. Kurzzeitig hatte ich etwas gefunden, mit dem ich aber doch nichts anfangen konnte, da ich für alle Sachen, die ich für mein Projekt wollte, hätte bezahlen müssen. Weil ich nicht mehr weiter nach Fussball-APIs suchen wollte, machte ich mich auf die Suche nach einem anderen Thema für meine Seite. Ich entschied mich schlussendlich für Clash Royale. Auf meiner Seite kann man jetzt alle Karten, die es im Spiel gibt, ansehen und sehen, wie viel sie kosten und welche Seltenheit sie haben. Man kann sie auch sortieren. Den Rest der Zeit habe ich noch meine HTML-Dateien angepasst, so, dass sie jetzt einigermassen auf Clash Royale abgestimmt sind.

14.11
- [ ] Desing der Seite ändern
- [ ] Das eigene Proifl suchen können
- [X] Kartenlevel seiner Truppen sehen können
- [X] Aktives Deck sehen können

Heute habe ich als erstes eine Suchfunktion hinzugefügt mit der man ein Profil via Spieler-ID finden kann. Jetzt habe ich begonnen mit  einem Knopf, es findet aber immer das selbe Profil, weil ich das so eingestellt habe, dass ich die Daten formatieren kann und anpassen kann, was angezeigt werden soll. Jetzt sieht man den Kampflog des Spielers, alle seine Karten und Kartenlevel. 

21.11
- [X] Desing der Seite ändern
- [X] Das eigene Profil suchen können
- [X] Die ergebnisse anpassen
- [ ] Leaderbord einfügen

Heute habe ich als Erstes etwas das Design verändert. Als Nächstes habe ich die Ansicht des gesuchten Profils verändert, sodass es besser aussieht, übersichtlicher und symmetrischer ist. Den Rest der Zeit habe ich damit verbracht, den Teil im Code zu verändern, der das gesuchte Profil auf nur 1 Profil beschränkt. Jetzt kann man ganz einfach die Spieler-ID ins Suchfeld eingeben und die dazugehörigen Spielerdaten einsehen.


28.11

- [X] Code vereinfachen
- [X] Die Namen und Tags im Kampflog zu Links zum jeweiligen Profil machen
- [X] Leaderbord hinzufügen


Heute habe ich als erstes Versucht den Code etwas zu vereinfachen/kürez was bisschen geklappt hat aber nicht sehr viel zu verändern war. Als nächstes habe ich die Spielernamen und SpielerIDs im Kampflog zu Links zu deren Profil gemacht, hierfür habe ich ein bisschen gebraucht, obwohl es gar nicht so schwer gewesen wäre. Das mit dem Leaderboard funktioniert auch, einfach ist es nicht die AKtuelle sondern die letzte Season. Ich habe einfach noch kein CSS dafür.


12.12

- [ ] Leaderboard auf die Aktuelle Season Updaten
- [x] CSS Code dafür schreiben
- [x] Möglichkeit sich mit seinem Profil anmelden zu können, um bei dein Account sein eigenes Profil angezeigen zu lassen.

Zuerst habe ich heute wieder versucht, im Leaderboard die neueste Season hinzuzufügen. Nach etwas Zeit habe ich herausgefunden, dass das gar nicht geht. Ich habe eine Dropdown-Liste hinzugefügt, um anzeigen zu können, von welcher Season man die Rangliste sehen will. Anschliessend habe ich ein CSS dazu geschrieben. Zum Schluss habe ich die Funktion hinzugefügt, sich sein eigenes Profil unter „dein Account“ anzusehen. Es ist ähnlich mit der normalen Profilansicht, aber man bekommt nochmal etwas mehr Infos.

19.12
- [x] Die Sachen die bei dein Account angezeigt anpassen, dass alles wichtig ist und schön formatiert
- [x] Unter Clan Clans anzeigen können und die Mitglieder auflisten können
- [x] Startseite etwas gestalten dass sie nicht so leer ist

Heute habe ich die letzten Änderungen an meinem Projekt vorgenommen. Jetzt werden im eigenen Profil alle wichtigen Infos (Deck, Kartenlevel, Masterys, etc.) angezeigt. Man kann die Karten auch nach Level sortieren. Als Nächstes habe ich den letzten fehlenden Teil der Seite hinzugefügt, die Clan-Seite. Hier kann man nach Clans via Name oder ID suchen. Während der Eingabe werden schon Clans vorgeschlagen, damit man es einfacher hat, sie zu suchen. Wenn man auf einen Clan klickt, werden einem die Mitglieder angezeigt und die Anzahl Trophäen, die jeder hat. Man kann auch auf die Namen draufdrücken und wird zu ihrem Profil geleitet. Überall, wo der Clan angezeigt wird, kann man jetzt auch auf den Namen/ID klicken und wird zur Clan-Seite weitergeleitet. Als Letztes habe ich noch die Startseite etwas verschönert und ein Hintergrundbild hinzugefügt.

## Fertiges Projekt
Mein fertiges Projekt ist eine Webseite, auf der man jegliche Sachen zum Spiel Clash Royale ansehen kann. Man kann die letzten Kämpfe jedes Spielers ansehen, oder Clans und Spielerprofile besichtigen. Es gibt auch die Möglichkeit, die Ranglisten der letzten 2 Jahre anzusehen. Auch ist es möglich, alle Karten im Spiel anzeigen zu lassen.
<img width="1353" height="556" alt="Screenshot 2025-12-19 112531" src="https://github.com/user-attachments/assets/c0c12f32-edfb-4764-9645-cd85370cd883" />

## Reflexion
Diese Lernperiode hat mir sehr gefallen, da ich gelernt habe, wie man Webseiten mit APIs verbinden kann und so seine Webseite mit echten Daten verbinden kann. Auch wenn ich am Anfang Probleme hatte mit dem Finden einer guten API und meine Idee wechseln musste, bin ich mit dem Endergebnis trotzdem sehr zufrieden. Durch diese Lernperiode konnte ich auch etwas besser JavaScript lernen und mein Wissen zu CSS und HTML auffrischen.


