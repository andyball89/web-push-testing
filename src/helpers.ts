export const updateUI = (serviceWorker: ServiceWorkerRegistration) => {
    const label = document.querySelector<HTMLButtonElement>('#serviceinfo')!;

    if (serviceWorker.pushManager) {
        label.innerHTML = `Service worker active`
    }
}

export const updateSubUI = (subscription: PushSubscription | null) => {
    const label = document.querySelector<HTMLButtonElement>('#subinfo')!;

    if (subscription) {
        label.innerHTML = `Push subscription details:  ${JSON.stringify(subscription)}`
    } else {
        label.innerHTML = `No subscription found`
    }

}