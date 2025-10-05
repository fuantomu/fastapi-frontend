<script lang="ts">
  import BottomAppBar, { Section } from "@smui-extra/bottom-app-bar";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import IconButton from "@smui/icon-button";
  import ChangeVersionList from "./ChangeVersionList.svelte";
  import { t } from "$lib/i18n/index.svelte";
</script>

<div class="flexy">
  <div class="bottom-app-bar-container flexor">
    <BottomAppBar variant="static" color={"secondary"}>
      <Section>
        <Wrapper>
          <IconButton
            class="material-icons"
            aria-label={t(`ui.reportBug`)}
            style="color: var(--palette-warning-main)"
            onclick={() =>
              window.open(
                "https://github.com/fuantomu/fastapi-frontend/issues"
              )}
          >
            bug_report
          </IconButton>
          <Tooltip yPos="above">{t(`ui.reportBug`)}</Tooltip>
        </Wrapper>
      </Section>

      <Section>
        <ChangeVersionList></ChangeVersionList>
      </Section>
    </BottomAppBar>
  </div>
</div>

<style>
  .bottom-app-bar-container {
    max-width: 480px;
    width: 100%;
    margin: 0 0 0 0;

    overflow: auto;
    display: inline-block;
  }

  @media (max-width: 480px) {
    .bottom-app-bar-container {
      margin-right: 0;
    }
  }

  .flexy {
    display: flex;
    flex-wrap: wrap;
  }

  .flexor {
    overflow: hidden;
    display: inline-flex;
    flex-direction: column;
  }
</style>
