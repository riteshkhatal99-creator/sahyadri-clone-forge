<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Theme architecture
- Keep shared colors and typography in global semantic CSS tokens, with web fonts loaded by the root route; this keeps every marketplace page visually consistent.
- Keep service preparation guidance and FAQs in a browser-safe shared module, separate from pricing and bidding rules, so informational changes cannot alter transaction logic.
