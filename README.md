# This is a Title

## This is a Subtitle

[This is a link]()

Hola me llamo Pablo vacas garcia

```python
<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  data() {
    return {
      currentUser: null
    }
  },

  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }
};
</script>
```

```bash
npm run dev
```
