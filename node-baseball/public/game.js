class BaseballGame {
  constructor(id) {
    this.id = id;

    this.$resultContainerEle = document.querySelector('.result-container');
    this.$guessEle = document.getElementById('guess-input');
  }

  async init() {
    try {
      const $guessLabel = document.getElementById('guess-label');
      const res = await fetch(`api/game/${this.id}`);
      const v = await res.json();

      this.digit = v.digit;
      this.history = v.history;
      this.done = v.done;

      this.history.forEach(({ guess, result }) => {
        this.renderResult(guess, result);
      });

      if (this.done) {
        this.makeEnd();
      }

      $guessLabel.innerHTML += ` (${this.digit}자리)`;
      this.bindEvent();

      return this;
    } catch (err) {
      alert('👽 ' + err);
    }
  }

  bindEvent() {
    this.$guessEle.addEventListener('keypress', async e => {
      const guess = e.target.value;
      if (e.code === 'NumpadEnter' || e.code === 'Enter') {
        const res = await this.askResult(guess);

        this.renderResult(guess, res.result);

        if (res.done) {
          res.done = this.done;
          this.makeEnd();
        }

        this.$guessEle.value = '';
      }
    });
  }

  async askResult(guess) {
    const res = await fetch(`api/game/${this.id}/guess`, {
      method: 'POST',
      body: JSON.stringify({ guess }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 400) {
      const { message } = await res.json();
      alert(message);
      throw new Error(message);
    } else {
      return res.json();
    }
  }

  renderResult(guess, result) {
    this.$resultContainerEle.insertAdjacentHTML(
      'beforeend',
      `<li class="list-group-item">
        <span class="guess">${guess}</span>
        <span class="badge result">${result}</span>
      </li>`
    );
  }

  makeEnd() {
    this.$guessEle.disabled = true;
    this.$guessEle.placeholder = '정답입니다!';
  }
}
